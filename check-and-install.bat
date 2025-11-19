@echo off
echo ========================================
echo   Dependency Checker and Installer
echo ========================================
echo.

REM Check if Node.js is available
echo Checking Node.js installation...
where node >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Node.js is installed
    node --version
    echo.
) else (
    echo [ERROR] Node.js not found!
    echo.
    echo Node.js is required to run this project.
    echo.
    echo Please:
    echo   1. Download Node.js from: https://nodejs.org/
    echo   2. Install the LTS version
    echo   3. Make sure "Add to PATH" is checked during installation
    echo   4. Restart your computer
    echo   5. Run this script again
    echo.
    echo Opening Node.js download page...
    start https://nodejs.org/en/download/
    echo.
    pause
    exit /b 1
)

REM Check if npm is available
echo Checking npm installation...
where npm >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] npm is installed
    npm --version
    echo.
) else (
    echo [ERROR] npm not found!
    echo npm should come with Node.js installation.
    echo Please reinstall Node.js.
    echo.
    pause
    exit /b 1
)

REM Check backend folder
if not exist "backend" (
    echo [ERROR] Backend folder not found!
    echo Please run this script from the project root directory.
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
echo Checking installed packages...
if exist "backend\node_modules" (
    echo [OK] node_modules folder exists
    echo.
    
    REM Check for specific packages
    echo Checking required packages:
    
    if exist "backend\node_modules\express" (
        echo   [OK] express
    ) else (
        echo   [MISSING] express
    )
    
    if exist "backend\node_modules\mongoose" (
        echo   [OK] mongoose
    ) else (
        echo   [MISSING] mongoose
    )
    
    if exist "backend\node_modules\bcryptjs" (
        echo   [OK] bcryptjs
    ) else (
        echo   [MISSING] bcryptjs
    )
    
    if exist "backend\node_modules\jsonwebtoken" (
        echo   [OK] jsonwebtoken
    ) else (
        echo   [MISSING] jsonwebtoken
    )
    
    if exist "backend\node_modules\cors" (
        echo   [OK] cors
    ) else (
        echo   [MISSING] cors
    )
    
    if exist "backend\node_modules\dotenv" (
        echo   [OK] dotenv
    ) else (
        echo   [MISSING] dotenv
    )
    
    if exist "backend\node_modules\nodemon" (
        echo   [OK] nodemon
    ) else (
        echo   [MISSING] nodemon
    )
    
    echo.
) else (
    echo [WARNING] node_modules folder not found
    echo.
)

REM Ask to install/update packages
echo.
echo Would you like to install/update all packages now? (Y/N)
set /p choice=
if /i "%choice%"=="Y" (
    echo.
    echo Installing packages...
    echo.
    cd backend
    call npm install
    cd ..
    echo.
    echo [OK] Installation complete!
    echo.
) else (
    echo.
    echo Skipping installation.
    echo You can install manually by running:
    echo   cd backend
    echo   npm install
    echo.
)

echo ========================================
echo   Summary
echo ========================================
echo.
echo Your project requires these packages:
echo   - express (Web framework)
echo   - mongoose (MongoDB connection)
echo   - bcryptjs (Password hashing)
echo   - jsonwebtoken (JWT authentication)
echo   - cors (Cross-origin support)
echo   - dotenv (Environment variables)
echo   - nodemon (Development tool)
echo   - nodemailer (Email support)
echo.
echo To start your server:
echo   1. Make sure MongoDB is running
echo   2. Run: start-server.bat
echo   3. Or manually: cd backend ^&^& node server.js
echo.

pause

