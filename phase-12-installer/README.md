# Phase 12 — One Click Installer

## What this phase covers

- setup.bat — full install from scratch, run once
- start.bat — quick daily launcher after setup is done
- stop.bat — cleanly stops all Vizora processes

## How to use

### First time setup
Double-click setup.bat
It will:
- Check Python, Node.js, Ollama are installed
- Ask you to pick a model size
- Pull the selected Ollama model
- Install all Python and Node packages
- Start backend and frontend
- Open browser automatically

### Daily use after setup
Double-click start.bat

### Stop Vizora
Double-click stop.bat

## Requirements before running setup.bat
- Python installed to D:\Python
- Node.js installed to D:\nodejs
- Ollama installed from ollama.com
- Internet connection for first model download

## Status

Phase 12 complete. Ready for Phase 13 — Google Drive sharing.