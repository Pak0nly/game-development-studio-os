@echo off
setlocal
cd /d "%~dp0"
if "%~1"=="" (
  echo Usage: Register-Previews.cmd "C:\path\to\preview-registration-input.json"
  exit /b 2
)
py -3 register_previews.py "%~1" --package "Packages\crime99-surface-material-v1.json" --runtime-data "RuntimeData"
endlocal

