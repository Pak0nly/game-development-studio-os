@echo off
setlocal
cd /d "%~dp0"
py -3 guided_preview_registration.py
if errorlevel 1 (
  echo.
  echo The guided local preview registration could not start.
  pause
)
endlocal

