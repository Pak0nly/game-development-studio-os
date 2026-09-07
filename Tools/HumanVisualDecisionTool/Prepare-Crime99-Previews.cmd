@echo off
setlocal
cd /d "%~dp0"
py -3 prepare_crime99_previews.py
if errorlevel 1 (
  echo.
  echo The prepared Crime99 preview set could not be generated.
  echo Review the local text log and keep Vendor imagery on this machine.
  pause
)
endlocal
