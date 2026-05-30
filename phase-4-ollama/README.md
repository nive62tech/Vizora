# Phase 4 — Ollama AI Integration

## What this phase covers

- Ollama running tinyllama model fully locally on CPU
- POST /chat endpoint that takes message + file context
- AI prompt includes filename, column names, and data preview
- Frontend useChat.js updated to call real /chat endpoint
- All AI runs on CPU locally, no internet needed ever
- phi3 was attempted but requires 3.5GB RAM — switched to tinyllama (600MB)

## How to run

Ollama runs automatically in the background on Windows after install.
No need to run `ollama serve` manually — it starts with Windows.

Model: tinyllama (stored at D:\ollama-models)

## Terminals needed

| Terminal | Location | Command |
|----------|----------|---------|
| 1 — Backend | phase-2-backend\app | uvicorn main:app --reload |
| 2 — Frontend | phase-3-frontend\client | npm run dev |

## Endpoints added

| Method | Path | Description |
|--------|------|-------------|
| POST | /chat | Send message + file context, get AI response |

## Status

Phase 4 complete. Ready for Phase 5 — Chart generation.