@echo off
cd /d "%~dp0"
for /d %%D in ("%~dp0.tools\node-*-win-x64") do set "PATH=%%D;%PATH%"
where node >nul 2>nul
if errorlevel 1 (
 echo Node.js is required. Install Node.js 22 LTS, then run this file again.
 pause
 exit /b 1
)
if not exist node_modules (
 call npm ci
 if errorlevel 1 (
  echo Dependency installation failed. Check your connection and try again.
  pause
  exit /b 1
 )
)
call npm start
pause
