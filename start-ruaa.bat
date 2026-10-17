@echo off
title Ruaa Creation - local website
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js is not installed. Download the LTS version from https://nodejs.org and run this file again. & pause & exit /b)
if not exist node_modules (
  echo Installing packages - first time only, takes 1-2 minutes...
  call npm install
)
echo Starting Ruaa Creation at http://localhost:3000
start "" http://localhost:3000
call npm run dev
pause
