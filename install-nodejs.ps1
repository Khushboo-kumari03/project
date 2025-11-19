# Node.js Installation Helper Script
# This script helps you install Node.js and all dependencies

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Node.js & Dependencies Installer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is already installed
Write-Host "Checking for Node.js installation..." -ForegroundColor Yellow
$nodeInstalled = $false

try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
        $nodeInstalled = $true
    }
} catch {
    Write-Host "✗ Node.js not found in PATH" -ForegroundColor Red
}

try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host "✓ npm is installed: v$npmVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ npm not found in PATH" -ForegroundColor Red
}

Write-Host ""

# If Node.js is not in PATH, try to find it
if (-not $nodeInstalled) {
    Write-Host "Searching for Node.js installation..." -ForegroundColor Yellow
    
    $possiblePaths = @(
        "C:\Program Files\nodejs",
        "C:\Program Files (x86)\nodejs",
        "$env:LOCALAPPDATA\Programs\nodejs",
        "$env:APPDATA\npm"
    )
    
    $foundPath = $null
    foreach ($path in $possiblePaths) {
        if (Test-Path "$path\node.exe") {
            Write-Host "✓ Found Node.js at: $path" -ForegroundColor Green
            $foundPath = $path
            break
        }
    }
    
    if ($foundPath) {
        Write-Host ""
        Write-Host "Node.js is installed but not in PATH!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To add it to PATH temporarily, run:" -ForegroundColor Cyan
        Write-Host "`$env:Path += ';$foundPath'" -ForegroundColor White
        Write-Host ""
        Write-Host "Or restart your computer to refresh PATH." -ForegroundColor Cyan
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "Node.js is NOT installed on this system." -ForegroundColor Red
        Write-Host ""
        Write-Host "Would you like to download Node.js now? (Y/N)" -ForegroundColor Yellow
        $response = Read-Host
        
        if ($response -eq "Y" -or $response -eq "y") {
            Write-Host ""
            Write-Host "Opening Node.js download page..." -ForegroundColor Green
            Start-Process "https://nodejs.org/en/download/"
            Write-Host ""
            Write-Host "Please:" -ForegroundColor Cyan
            Write-Host "  1. Download the LTS version (recommended)" -ForegroundColor White
            Write-Host "  2. Run the installer" -ForegroundColor White
            Write-Host "  3. Make sure 'Add to PATH' is checked" -ForegroundColor White
            Write-Host "  4. Restart your computer after installation" -ForegroundColor White
            Write-Host "  5. Run this script again" -ForegroundColor White
            Write-Host ""
        } else {
            Write-Host ""
            Write-Host "Installation cancelled." -ForegroundColor Yellow
            Write-Host "You can download Node.js manually from: https://nodejs.org/" -ForegroundColor Cyan
            Write-Host ""
        }
        
        pause
        exit
    }
}

# Check installed packages
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Checking Installed Packages" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$backendPath = "backend"
if (Test-Path $backendPath) {
    Write-Host "Checking backend dependencies..." -ForegroundColor Yellow
    Write-Host ""
    
    $requiredPackages = @(
        "express",
        "mongoose",
        "bcryptjs",
        "jsonwebtoken",
        "cors",
        "dotenv",
        "nodemon",
        "nodemailer"
    )
    
    $missingPackages = @()
    
    foreach ($package in $requiredPackages) {
        $packagePath = Join-Path $backendPath "node_modules\$package"
        if (Test-Path $packagePath) {
            Write-Host "  ✓ $package" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $package (MISSING)" -ForegroundColor Red
            $missingPackages += $package
        }
    }
    
    Write-Host ""
    
    if ($missingPackages.Count -gt 0) {
        Write-Host "Missing packages detected!" -ForegroundColor Yellow
        Write-Host ""
        
        if ($nodeInstalled) {
            Write-Host "Would you like to install missing packages now? (Y/N)" -ForegroundColor Yellow
            $response = Read-Host
            
            if ($response -eq "Y" -or $response -eq "y") {
                Write-Host ""
                Write-Host "Installing missing packages..." -ForegroundColor Green
                Write-Host ""
                
                Set-Location $backendPath
                npm install
                Set-Location ..
                
                Write-Host ""
                Write-Host "✓ Installation complete!" -ForegroundColor Green
                Write-Host ""
            }
        } else {
            Write-Host "Please install Node.js first, then run:" -ForegroundColor Yellow
            Write-Host "  cd backend" -ForegroundColor White
            Write-Host "  npm install" -ForegroundColor White
            Write-Host ""
        }
    } else {
        Write-Host "✓ All packages are installed!" -ForegroundColor Green
        Write-Host ""
    }
} else {
    Write-Host "✗ Backend folder not found!" -ForegroundColor Red
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($nodeInstalled) {
    Write-Host "✓ Node.js: Ready" -ForegroundColor Green
    Write-Host "✓ npm: Ready" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now start your server:" -ForegroundColor Cyan
    Write-Host "  cd backend" -ForegroundColor White
    Write-Host "  node server.js" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "⚠ Node.js: Not in PATH" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Install Node.js from https://nodejs.org/" -ForegroundColor White
    Write-Host "  2. Restart your computer" -ForegroundColor White
    Write-Host "  3. Run this script again" -ForegroundColor White
    Write-Host ""
}

pause

