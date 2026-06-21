# Vizora

> Fully local, privacy-first AI-powered data visualization and dashboard tool.

No cloud. No accounts. No data ever leaves your machine. Not even for AI.

![Vizora Dashboard](docs/screenshots/dashboard.png)

---

## What is Vizora?

Vizora lets you drop a CSV, Excel, or JSON file into the app, chat with your data in plain English, and get interactive charts and dashboards — all running entirely on your machine.

- The AI runs locally via Ollama
- Charts render in your browser via Plotly
- All files stay on your machine
- Works completely offline after setup

---

## Features

- Drag and drop CSV, Excel, or JSON files
- Chat with your data in plain English
- Auto-numbered interactive chart library (#1, #2, #3...)
- Ask for specific charts — "show me salary by city as a bar chart"
- Build dashboards by saying "create a dashboard with charts 1, 2 and 3"
- Live chat to edit dashboards after building — add, remove, rename charts
- Export charts and dashboards as PNG, HTML, or PDF
- LAN mode — host on one machine, whole team connects via browser on same WiFi
- Pick your model size at setup: TinyLlama (600MB), Phi-3 Mini (2.3GB), or Mistral (4GB)
- Works completely offline after setup
- Free forever, open source, MIT license

---

## Why Vizora?

| Feature | Vizora | Tableau | PowerBI | Google Looker |
|---------|--------|---------|---------|---------------|
| Fully local | ✅ | ❌ | ❌ | ❌ |
| Free forever | ✅ | ❌ | ❌ | ❌ |
| No account needed | ✅ | ❌ | ❌ | ❌ |
| Works offline | ✅ | ❌ | ❌ | ❌ |
| Chat with data | ✅ | ❌ | ❌ | ❌ |
| LAN team mode | ✅ | ❌ | ❌ | ❌ |
| Data never leaves machine | ✅ | ❌ | ❌ | ❌ |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Tailwind CSS + Vite |
| Charts | Plotly.js |
| Backend | FastAPI (Python) |
| AI | Ollama (runs fully locally) |
| Data | Pandas |

---

## Quick Start

### Requirements
- Windows PC (Mac/Linux support coming soon)
- Python 3.10+
- Node.js 18+
- Ollama
- 1GB+ free RAM (4GB recommended for better models)

### Install

1. Download and install [Python](https://python.org) — check "Add to PATH"
2. Download and install [Node.js](https://nodejs.org) — choose LTS
3. Download and install [Ollama](https://ollama.com)
4. Clone this repo or download the zip
5. Run `phase-12-installer\setup.bat`
6. Pick your model size when prompted
7. Vizora opens in your browser automatically

### Daily Use

After setup just run `phase-12-installer\start.bat` to launch Vizora.

---

## How to Use

### Analyze data
1. Drop a CSV, Excel, or JSON file into the sidebar
2. Ask questions in the chat — "what is the average salary?"

### Create charts
- "show me a bar chart"
- "plot salary by city"
- "show me age distribution as a histogram"
- "create a pie chart of salary by name"

### Build dashboards
- First create some charts
- Then say "create a dashboard with charts 1, 2 and 3"
- Use the Live Edit panel to modify the dashboard

### Export
- Click PNG, HTML, or PDF buttons on any chart or dashboard

### LAN mode
- Start backend with `uvicorn main:app --host 0.0.0.0 --port 8000`
- Teammates on the same WiFi open the IP shown in the green banner

---

## Project Structure
Vizora/

├── phase-2-backend/      # FastAPI backend

├── phase-3-frontend/     # React frontend

├── phase-4-ollama/       # Ollama AI integration

├── phase-5-charts/       # Chart generation

├── phase-6-chart-library/# Chart library

├── phase-7-dashboard/    # Dashboard builder

├── phase-8-live-chat/    # Live dashboard editing

├── phase-9-export/       # PNG, HTML, PDF export

├── phase-10-model-selector/ # Model selection

├── phase-11-lan-mode/    # LAN team mode

├── phase-12-installer/   # One click installer

├── phase-13-sharing/     # Google Drive sharing

└── docs/                 # Documentation

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guide.

We welcome:
- Bug reports
- Feature requests
- Pull requests
- Documentation improvements

---

## License

MIT — free to use, modify, and distribute.

---

## Roadmap

- [ ] Mac and Linux support
- [ ] More chart types (heatmap, treemap, funnel)
- [ ] Multiple file support
- [ ] Save and load sessions
- [ ] Custom AI prompts
- [ ] Dark/light theme toggle
- [ ] More export formats

---

*Built with ❤️ — fully local, zero cloud, your data stays yours.*