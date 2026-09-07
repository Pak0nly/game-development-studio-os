@echo off
setlocal
cd /d "%~dp0"
py -3 prepare_crime99_previews.py --register-existing --package "Packages\crime99-surface-material-v1.json" --runtime-data "RuntimeData"
if errorlevel 1 (
  echo.
  echo The prepared Crime99 preview set is unavailable.
  echo Run Prepare-Crime99-Previews.cmd as an advanced maintenance task.
  pause
  exit /b 1
)
py -3 server.py --package "Packages\crime99-surface-material-v1.json" --runtime-data "RuntimeData" --open
if errorlevel 1 (
  echo.
  echo The Human Visual Decision Tool could not start.
  echo Confirm that Python 3 is installed, then try again.
  pause
)
endlocal
