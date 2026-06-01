@echo off
title Stopping Vizora
echo.
echo  Stopping Vizora...
echo.
taskkill /f /fi "WINDOWTITLE eq Vizora Backend*" >nul 2>&1
taskkill /f /fi "WINDOWTITLE eq Vizora Frontend*" >nul 2>&1
taskkill /f /im "node.exe" >nul 2>&1
echo  Vizora stopped.
echo.
pause