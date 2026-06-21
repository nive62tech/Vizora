# Contributing to Vizora

Thank you for your interest in contributing to Vizora! This guide will help you get started.

---

## Ways to Contribute

- Report bugs via GitHub Issues
- Request features via GitHub Issues
- Fix bugs and submit Pull Requests
- Improve documentation
- Test on different machines and operating systems

---

## Getting Started

### 1. Fork the repo

Click Fork on the GitHub page to create your own copy.

### 2. Clone your fork

```bash
git clone https://github.com/YOUR_USERNAME/Vizora.git
cd Vizora
```

### 3. Set up the backend

```bash
cd phase-2-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd app
uvicorn main:app --reload
```

### 4. Set up the frontend

```bash
cd phase-3-frontend\client
npm install
npm run dev
```

### 5. Set up Ollama

Install Ollama from https://ollama.com then run:
```bash
ollama pull tinyllama
```

### 6. Open the app

Go to http://localhost:5173

---

## Making Changes

### Backend changes
- All backend code lives in `phase-2-backend/app/`
- Phase-specific logic lives in `phase4_chat/`, `phase5_charts/` etc.
- Add new routes in the relevant phase folder
- Register new routers in `main.py`

### Frontend changes
- All frontend code lives in `phase-3-frontend/client/src/`
- Components in `src/components/`
- Pages in `src/pages/`
- API calls in `src/services/api.js`
- Shared state hooks in `src/hooks/`

---

## Pull Request Guidelines

1. Create a new branch for your change:
```bash
git checkout -b fix/your-bug-name
```

2. Make your changes

3. Test everything works:
   - Backend health check passes
   - File upload works
   - Chart generation works
   - No console errors in browser

4. Commit with a clear message:
```bash
git commit -m "fix: description of what you fixed"
```

5. Push and open a Pull Request against the `main` branch

6. Fill in the Pull Request template

---

## Commit Message Format

Use these prefixes:
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation change
- `style:` — formatting, no logic change
- `refactor:` — code restructure, no feature change
- `test:` — adding tests

---

## Code Style

### Python
- Follow PEP 8
- Use type hints where possible
- Keep functions small and focused
- Add docstrings to public functions

### JavaScript / React
- Use functional components with hooks
- Keep components small and single-purpose
- Use meaningful variable names
- No inline styles — use Tailwind classes

---

## Reporting Bugs

Use the Bug Report issue template and include:
- What you did
- What you expected
- What actually happened
- Your OS and Python/Node versions
- Any error messages from the terminal

---

## Feature Requests

Use the Feature Request issue template and include:
- What problem it solves
- How you imagine it working
- Any examples from other tools

---

## Questions?

Open a GitHub Issue with your question. We're happy to help!

---

*Vizora is fully local and privacy-first. All contributions must maintain this principle — no cloud dependencies, no external APIs, no data leaving the machine.*