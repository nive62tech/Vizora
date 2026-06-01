@echo off
title Vizora
color 0A
echo.
echo  Starting Vizora...
echo.

set SCRIPT_DIR=%~dp0

REM Start backend
start "Vizora Backend" cmd /k "cd /d %SCRIPT_DIR%..\phase-2-backend\app && call ..\venv\Scripts\activate.bat && uvicorn main:app --host 0.0.0.0 --port 8000"
timeout /t 3 /nobreak >nul

REM Start frontend
start "Vizora Frontend" cmd /k "cd /d %SCRIPT_DIR%..\phase-3-frontend\client && npm run dev"
timeout /t 5 /nobreak >nul

REM Open browser
start http://localhost:5173

echo  Vizora is running at http://localhost:5173
echo  Close this window to stop.
echo.
pause