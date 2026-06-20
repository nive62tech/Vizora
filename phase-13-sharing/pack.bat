@echo off
title Vizora — Pack for Sharing
color 0A
echo.
echo  Vizora — Pack for Sharing
echo  ===========================
echo  Creates a zip file you can share via Google Drive.
echo  Models, venv, and node_modules are excluded.
echo.

set SCRIPT_DIR=%~dp0
set PROJECT_DIR=%SCRIPT_DIR%..
set OUTPUT_FILE=D:\Vizora-share.zip
set TEMP_DIR=D:\VizoraPack_Temp

echo  Cleaning up Python cache files...
for /d /r "%PROJECT_DIR%" %%d in (__pycache__) do (
    if exist "%%d" rd /s /q "%%d" >nul 2>&1
)
del /s /q "%PROJECT_DIR%\*.pyc" >nul 2>&1
echo  Done cleaning.
echo.

echo  Creating zip file at D:\Vizora-share.zip
echo  This may take a minute...
echo.

if exist "%OUTPUT_FILE%" del "%OUTPUT_FILE%"
if exist "%TEMP_DIR%" rd /s /q "%TEMP_DIR%"
mkdir "%TEMP_DIR%"

powershell -ExecutionPolicy Bypass -Command ^
  "$src = (Resolve-Path '%PROJECT_DIR%').Path.TrimEnd('\');" ^
  "$tmpDir = '%TEMP_DIR%';" ^
  "$dst = '%OUTPUT_FILE%';" ^
  "$exclude = @('venv','node_modules','.git','__pycache__','ollama-models','uploads');" ^
  "$files = Get-ChildItem -Path $src -Recurse -File | Where-Object {" ^
  "  $rel = $_.FullName.Substring($src.Length + 1);" ^
  "  $parts = $rel -split '[/\\\\]';" ^
  "  $skip = $false;" ^
  "  foreach ($p in $parts) { if ($exclude -contains $p) { $skip = $true; break } };" ^
  "  -not $skip" ^
  "};" ^
  "Write-Host \"Copying $($files.Count) files...\";" ^
  "foreach ($f in $files) {" ^
  "  $rel = $f.FullName.Substring($src.Length + 1);" ^
  "  $dest = Join-Path $tmpDir $rel;" ^
  "  $destDir = Split-Path $dest -Parent;" ^
  "  if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null };" ^
  "  Copy-Item $f.FullName $dest" ^
  "};" ^
  "Write-Host 'Compressing...';" ^
  "Compress-Archive -Path \"$tmpDir\*\" -DestinationPath $dst -Force;" ^
  "Remove-Item $tmpDir -Recurse -Force;" ^
  "Write-Host 'Done.'"

if not exist "%OUTPUT_FILE%" (
    echo.
    echo  Failed to create zip file.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo  Done! File saved to: D:\Vizora-share.zip
echo.
echo  To share:
echo  1. Upload D:\Vizora-share.zip to Google Drive
echo  2. Share the link
echo  3. Receiver unzips and runs setup.bat
echo ============================================================
echo.
pause