from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import httpx
import asyncio

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    column_names: Optional[List[str]] = []
    preview: Optional[List[dict]] = []
    filename: Optional[str] = ""


class ChatResponse(BaseModel):
    response: str


async def ask_ollama(prompt: str, model: str = "tinyllama") -> str:
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

        prompt = f"""You are Vizora, an AI data analyst assistant. The user has uploaded a data file and wants to analyze it.

File: {request.filename}
Columns: {columns_str}
Sample data (first 3 rows): {preview_str}

User question: {request.message}

Give a clear, helpful, concise answer about this data. If the user asks for a chart or visualization, describe what kind of chart would work best and what insights it would show. Keep your response under 150 words."""

        response_text = await ask_ollama(prompt)
        return ChatResponse(response=response_text)

    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail="Cannot connect to Ollama. Make sure 'ollama serve' is running in a terminal."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")