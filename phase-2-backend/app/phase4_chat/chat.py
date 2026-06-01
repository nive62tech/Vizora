from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import httpx
import json
import os

router = APIRouter()

CONFIG_FILE = os.path.join(os.path.dirname(__file__), '..', 'vizora_config.json')


def get_current_model() -> str:
    if not os.path.exists(CONFIG_FILE):
        return "tinyllama"
    with open(CONFIG_FILE, 'r') as f:
        config = json.load(f)
    return config.get("model", "tinyllama")


class ChatRequest(BaseModel):
    message: str
    column_names: Optional[List[str]] = []
    preview: Optional[List[dict]] = []
    filename: Optional[str] = ""


class ChatResponse(BaseModel):
    response: str


async def ask_ollama(prompt: str, model: str = None) -> str:
    if model is None:
        model = get_current_model()
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
    }
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        return data.get("response", "").strip()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        columns_str = ", ".join(request.column_names) if request.column_names else "unknown"
        preview_str = str(request.preview[:3]) if request.preview else "no preview available"
        model = get_current_model()

        prompt = f"""You are Vizora, an AI data analyst assistant. The user has uploaded a data file and wants to analyze it.

File: {request.filename}
Columns: {columns_str}
Sample data (first 3 rows): {preview_str}

User question: {request.message}

Give a clear, helpful, concise answer about this data. If the user asks for a chart or visualization, describe what kind of chart would work best and what insights it would show. Keep your response under 150 words."""

        response_text = await ask_ollama(prompt, model)
        return ChatResponse(response=response_text)

    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail="Cannot connect to Ollama. Make sure Ollama is running."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")