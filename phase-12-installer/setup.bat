@echo off
title Vizora Setup
color 0A
echo.
echo  ██╗   ██╗██╗███████╗ ██████╗ ██████╗  █████╗
echo  ██║   ██║██║╚══███╔╝██╔═══██╗██╔══██╗██╔══██╗
echo  ██║   ██║██║  ███╔╝ ██║   ██║██████╔╝███████║
echo  ╚██╗ ██╔╝██║ ███╔╝  ██║   ██║██╔══██╗██╔══██║
echo   ╚████╔╝ ██║███████╗╚██████╔╝██║  ██║██║  ██║
echo    ╚═══╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
echo.
echo  Fully local, privacy-first AI data visualization
echo  No cloud. No accounts. Your data stays on your machine.
echo.
echo ============================================================
echo  Starting Vizora Setup...
echo ============================================================
echo.

REM ── CHECK PYTHON ──────────────────────────────────────────────
echo [1/6] Checking Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  Python not found.
    echo  Please install Python from https://python.org
    echo  During install: check "Add Python to PATH"
    echo  Recommended path: D:\Python
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do echo  Found: %%i
echo.

REM ── CHECK NODE ────────────────────────────────────────────────
echo [2/6] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  Node.js not found.
    echo  Please install Node.js from https://nodejs.org
    echo  Recommended path: D:\nodejs
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo  Found: Node %%i
echo.

REM ── CHECK OLLAMA ──────────────────────────────────────────────
echo [3/6] Checking Ollama...
ollama --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  Ollama not found.
    echo  Please install Ollama from https://ollama.com
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('ollama --version') do echo  Found: %%i
echo.

REM ── SET OLLAMA MODEL PATH ─────────────────────────────────────
echo [4/6] Configuring Ollama model path...
set OLLAMA_MODELS=D:\ollama-models
if not exist "D:\ollama-models" mkdir "D:\ollama-models"
echo  Ollama models will be stored at D:\ollama-models
echo.

REM ── PICK MODEL ────────────────────────────────────────────────
echo [5/6] Choose your AI model:
echo.
echo  [1] TinyLlama  — 600MB  — Fast, works on any machine
echo  [2] Phi-3 Mini — 2.3GB  — Balanced speed and quality
echo  [3] Mistral    — 4GB    — Best quality, needs more RAM
echo.
set /p MODEL_CHOICE="Enter 1, 2 or 3 (default 1): "

if "%MODEL_CHOICE%"=="2" (
    set MODEL_NAME=phi3
    set MODEL_LABEL=Phi-3 Mini
) else if "%MODEL_CHOICE%"=="3" (
    set MODEL_NAME=mistral
    set MODEL_LABEL=Mistral
) else (
    set MODEL_NAME=tinyllama
    set MODEL_LABEL=TinyLlama
)

echo.
echo  Selected: %MODEL_LABEL%
echo  Pulling model... this may take several minutes depending on your internet speed.
echo.
ollama pull %MODEL_NAME%
if %errorlevel% neq 0 (
    echo  Failed to pull model. Make sure Ollama is running and you have internet access.
    pause
    exit /b 1
)
echo  Model ready.
echo.

REM ── SAVE MODEL TO CONFIG ──────────────────────────────────────
echo  Saving model selection...
set SCRIPT_DIR=%~dp0
set CONFIG_FILE=%SCRIPT_DIR%..\phase-2-backend\app\vizora_config.json
echo {"model": "%MODEL_NAME%", "setup_complete": true} > "%CONFIG_FILE%"
echo  Config saved.
echo.

REM ── INSTALL BACKEND DEPS ──────────────────────────────────────
echo [6/6] Installing dependencies...
echo.
echo  Installing Python packages...
cd /d "%SCRIPT_DIR%..\phase-2-backend"
if not exist "venv" (
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt --quiet
if %errorlevel% neq 0 (
    echo  Failed to install Python packages.
    pause
    exit /b 1
)
echo  Python packages installed.
echo.

REM ── INSTALL FRONTEND DEPS ─────────────────────────────────────
echo  Installing Node packages...
cd /d "%SCRIPT_DIR%..\phase-3-frontend\client"
if not exist "node_modules" (
    npm install --silent
)
echo  Node packages installed.
echo.

REM ── START BACKEND ─────────────────────────────────────────────
echo ============================================================
echo  Starting Vizora...
echo ============================================================
echo.
echo  Starting backend...
cd /d "%SCRIPT_DIR%..\phase-2-backend"
call venv\Scripts\activate.bat
start "Vizora Backend" cmd /k "cd /d %SCRIPT_DIR%..\phase-2-backend\app && uvicorn main:app --host 0.0.0.0 --port 8000"
timeout /t 3 /nobreak >nul

REM ── START FRONTEND ────────────────────────────────────────────
echo  Starting frontend...
start "Vizora Frontend" cmd /k "cd /d %SCRIPT_DIR%..\phase-3-frontend\client && npm run dev"
timeout /t 5 /nobreak >nul

REM ── OPEN BROWSER ──────────────────────────────────────────────
echo  Opening Vizora in browser...
start http://localhost:5173
echo.
echo ============================================================
echo  Vizora is running!
echo.
echo  Local:   http://localhost:5173
echo  Backend: http://localhost:8000
echo.
echo  Keep this window open while using Vizora.
echo  Close it to stop Vizora.
echo ============================================================
echo.
pause