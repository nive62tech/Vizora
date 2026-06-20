# Phase 13 — Google Drive Sharing

## What this phase covers

- pack.bat creates Vizora-share.zip on the Desktop
- Excludes venv, node_modules, .git, ollama models, uploads
- Final zip is around 50MB
- unpack.bat guides the receiver through setup steps
- Receiver runs setup.bat and everything installs automatically

## How to share Vizora

### Sender (you)
1. Run pack.bat from phase-13-sharing folder
2. Find Vizora-share.zip on your Desktop
3. Upload to Google Drive
4. Share the download link

### Receiver (teammate)
1. Download Vizora-share.zip
2. Right-click and Extract All
3. Open the Vizora folder
4. Install Python, Node.js, Ollama if not already installed
5. Double-click phase-12-installer\setup.bat
6. Follow the prompts
7. Vizora opens in browser automatically

## What is excluded from the zip

- venv/ — Python virtual environment (recreated by setup.bat)
- node_modules/ — Node packages (reinstalled by setup.bat)
- .git/ — Git history (not needed by receiver)
- ollama-models/ — AI model files (downloaded by setup.bat)
- uploads/ — User data files (private, not shared)
- chart_library.json — User charts (private)
- dashboards.json — User dashboards (private)
- vizora_config.json — User settings (private)

## Status

Phase 13 complete. Ready for Phase 14 — Polish and open source launch.