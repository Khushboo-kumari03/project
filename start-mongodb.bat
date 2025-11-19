@echo off
echo ========================================
echo   Starting MongoDB Server
echo ========================================
echo.

echo Checking MongoDB service status...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% == 0 (
    echo MongoDB is already running!
    echo.
    goto :test_connection
)

echo MongoDB is not running. Attempting to start...
echo.
echo NOTE: This requires Administrator privileges.
echo If it fails, right-click this file and select "Run as administrator"
echo.

net start MongoDB
if %errorlevel% == 0 (
    echo.
    echo SUCCESS! MongoDB started successfully.
    echo.
    goto :test_connection
) else (
    echo.
    echo FAILED to start MongoDB service.
    echo.
    echo Please try one of these options:
    echo.
    echo Option 1: Right-click this file and select "Run as administrator"
    echo.
    echo Option 2: Open PowerShell as Admin and run:
    echo    Start-Service -Name MongoDB
    echo.
    echo Option 3: Use MongoDB Atlas (cloud) - see FIX_MONGODB_CONNECTION.md
    echo.
    pause
    exit /b 1
)

:test_connection
echo Testing MongoDB connection on port 27017...
powershell -Command "Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue | Select-Object -ExpandProperty TcpTestSucceeded"
if %errorlevel% == 0 (
    echo.
    echo SUCCESS! MongoDB is accessible on port 27017
    echo.
    echo You can now:
    echo   1. Connect MongoDB Compass to: mongodb://localhost:27017
    echo   2. Start your backend server: start-server.bat
    echo.
) else (
    echo.
    echo WARNING: Cannot connect to MongoDB on port 27017
    echo MongoDB service may be starting up... wait a few seconds and try again.
    echo.
)

pause

