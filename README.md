# Vizora

Fully local, privacy-first AI-powered data visualization and dashboard tool.

## What is Vizora?

Vizora lets you drop a CSV, Excel, or JSON file into the app, chat with your data in plain English, and get interactive charts and dashboards — all running entirely on your machine. No cloud. No accounts. No data ever leaves your system. Not even for AI.

## Features

- Drag and drop CSV, Excel, or JSON files
- Chat with your data in plain English
- Auto-numbered interactive chart library (#1, #2, #3...)
- Build dashboards by saying "create a dashboard with charts 1, 2 and 4"
- Live chat to edit dashboards after building
- Export charts and dashboards as PDF, PNG, or HTML
- LAN mode — host on one machine, whole team connects via browser on same WiFi
- Pick your model size at setup: TinyLlama (600MB), Phi-3 Mini (2.3GB), or Mistral (4GB)
- Works completely offline after setup
- Free forever, open source, MIT license

## Why Vizora?

Unlike Tableau, PowerBI, or Google Looker:
- Zero cloud — your data never leaves your machine, ever
- No subscriptions, no accounts, no tracking
- Chat naturally with your data
- Build dashboards just by saying chart numbers
- Works offline
- LAN mode for teams with one download

## Tech Stack

- **Frontend:** React + Tailwind CSS + Plotly + Vite
- **Backend:** FastAPI (Python)
- **AI:** Ollama (runs fully locally)
- **Data:** Pandas
- **Charts:** Plotly

## Quick Start

Run `setup.bat` and everything installs automatically.

See [docs/setup-guide.md](docs/setup-guide.md) for full setup instructions.

## License

MIT — free to use, modify, and distribute.