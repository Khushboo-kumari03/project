@echo off
echo ========================================
echo   Electronics Store - Server Startup
echo ========================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB connection...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% == 0 (
    echo [OK] MongoDB is running on port 27017
) else (
    echo [WARNING] MongoDB is not running!
    echo Please start MongoDB first: start-mongodb.bat
    echo.
    pause
    exit /b 1
)
echo.

REM Check if .env file exists
if not exist "backend\.env" (
    echo Creating .env file from template...
    copy "backend\.env.example" "backend\.env" >nul 2>&1
    echo [OK] .env file created
    echo.
)

REM Check if node is available
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found in PATH!
    echo.
    echo Please try one of these solutions:
    echo   1. Close this window and open a NEW terminal
    echo   2. Install Node.js from: https://nodejs.org/
    echo   3. Restart your computer after Node.js installation
    echo.
    pause
    exit /b 1
)

REM Start the server
echo ========================================
echo   Server Information
echo ========================================
echo   Backend API:  http://localhost:4001
echo   MongoDB:      mongodb://localhost:27017
echo   Database:     electronics_store
echo ========================================
echo.
echo API Endpoints:
echo   http://localhost:4001/api/products
echo   http://localhost:4001/api/categories
echo.
echo MongoDB Compass Connection:
echo   mongodb://localhost:27017
echo.
echo Starting backend server on port 4001...
echo Press Ctrl+C to stop the server
echo.
cd backend
node server.js

pause

