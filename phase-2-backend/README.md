# Phase 2 — FastAPI Backend

## What this phase covers

- FastAPI app with CORS configured for frontend on port 5173
- GET /health endpoint
- POST /upload endpoint accepting CSV, Excel, JSON
- File parser service using Pandas
- Pydantic response model for upload

## How to run

From D:\projects\Vizora\phase-2-backend:

```bash
venv\Scripts\activate
cd app
uvicorn main:app --reload
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Check if backend is running |
| POST | /upload | Upload CSV, Excel, or JSON file |
| GET | /docs | Auto-generated API docs |

## Status

Phase 2 complete. Ready for Phase 3 — React frontend.