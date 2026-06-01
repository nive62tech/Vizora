from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import json
import os
import httpx

router = APIRouter()

CONFIG_FILE = os.path.join(os.path.dirname(__file__), '..', 'vizora_config.json')

AVAILABLE_MODELS = {
    "tinyllama": {
        "name": "TinyLlama",
        "size": "600MB",
        "description": "Fastest, lowest memory usage. Good for basic questions.",
        "ollama_name": "tinyllama",
    },
    "phi3": {
        "name": "Phi-3 Mini",
        "size": "2.3GB",
        "description": "Balanced speed and quality. Good for most data analysis.",
        "ollama_name": "phi3",
    },
    "mistral": {
        "name": "Mistral",
        "size": "4GB",
        "description": "Best quality responses. Needs more RAM and is slower.",
        "ollama_name": "mistral",
    },
}


def load_config() -> dict:
    if not os.path.exists(CONFIG_FILE):
        return {"model": None, "setup_complete": False}
    with open(CONFIG_FILE, 'r') as f:
        return json.load(f)


def save_config(config: dict):
    with open(CONFIG_FILE, 'w') as f:
        json.dump(config, f, indent=2)


def get_current_model() -> str:
    config = load_config()
    return config.get("model", "tinyllama")


class SelectModelRequest(BaseModel):
    model_key: str


@router.get("/models/available")
async def get_available_models():
    return {"models": AVAILABLE_MODELS}


@router.get("/models/current")
async def get_current_model_endpoint():
    config = load_config()
    model_key = config.get("model", None)
    return {
        "model": model_key,
        "setup_complete": config.get("setup_complete", False),
        "model_info": AVAILABLE_MODELS.get(model_key, None) if model_key else None,
    }


@router.post("/models/select")
async def select_model(request: SelectModelRequest):
    if request.model_key not in AVAILABLE_MODELS:
        raise HTTPException(status_code=400, detail=f"Unknown model: {request.model_key}")

    config = load_config()
    config["model"] = request.model_key
    config["setup_complete"] = True
    save_config(config)

    return {
        "message": f"Model set to {AVAILABLE_MODELS[request.model_key]['name']}",
        "model": request.model_key,
    }


@router.post("/models/reset")
async def reset_model_selection():
    config = load_config()
    config["setup_complete"] = False
    save_config(config)
    return {"message": "Model selection reset. Restart the app to see the setup screen."}


@router.get("/models/check-ollama")
async def check_ollama():
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get("http://localhost:11434/api/tags")
            data = response.json()
            installed_models = [m['name'].split(':')[0] for m in data.get('models', [])]
            return {"running": True, "installed_models": installed_models}
    except Exception:
        return {"running": False, "installed_models": []}