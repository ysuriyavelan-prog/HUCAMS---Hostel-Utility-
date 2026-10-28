@echo off
setlocal
title HUCAMS Launcher

echo ===================================================
echo       HUCAMS - Hostel Utility Analytics System
echo ===================================================

:: 1. Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed.
    echo Please install Node.js LTS from https://nodejs.org/ and restart this script.
    pause
    exit /b
)

:: 2. Check and Install Server Dependencies
echo.
echo [1/3] Checking Backend Dependencies...
if not exist "hucams\server\node_modules" (
    echo     Installing server dependencies...
    cd hucams\server
    call npm install
    cd ..\..
) else (
    echo     Server dependencies already installed.
)

:: 3. Check and Install Client Dependencies
echo.
echo [2/3] Checking Frontend Dependencies...
if not exist "hucams\client\node_modules" (
    echo     Installing client dependencies...
    cd hucams\client
    call npm install
    cd ..\..
) else (
    echo     Client dependencies already installed.
)

:: 4. Start Services
echo.
echo [3/3] Starting Services...

:: Start Backend
echo     Starting Backend (Port 5000)...
start "HUCAMS Backend" cmd /k "cd hucams\server && echo Starting Server... && npm start"

:: Start Frontend
echo     Starting Frontend...
:: Giving backend a moment to initialize
timeout /t 3 >nul
start "HUCAMS Frontend" cmd /k "cd hucams\client && echo Starting Client... && npm run dev"

:: Open Browser
echo.
echo HUCAMS is launching!
echo Opening http://localhost:5173...
timeout /t 5 >nul
start http://localhost:5173

echo.
echo ===================================================
echo    Services are running in separate windows.
echo    Close those windows to stop the servers.
echo ===================================================
pause
