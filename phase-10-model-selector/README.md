# Phase 10 — Model Selector

## What this phase covers

- First run setup screen to pick AI model
- Three options: TinyLlama (600MB), Phi-3 Mini (2.3GB), Mistral (4GB)
- Selection saved to vizora_config.json
- Ollama status check — shows if running and which models are installed
- Backend chat route reads config to use selected model
- Settings button in sidebar to change model anytime
- Setup screen skipped after first selection

## Models

| Model | Size | Best for |
|-------|------|----------|
| TinyLlama | 600MB | Fast, low RAM |
| Phi-3 Mini | 2.3GB | Balanced |
| Mistral | 4GB | Best quality |

## Status

Phase 10 complete. Ready for Phase 11 — LAN mode.