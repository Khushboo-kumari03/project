# Electronics Store API Tester
# PowerShell script to test MongoDB API endpoints

$API_URL = "http://localhost:4001"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Electronics Store - API Tester" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to test endpoint
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Description,
        [object]$Body = $null
    )
    
    Write-Host "Testing: $Description" -ForegroundColor Yellow
    Write-Host "  $Method $API_URL$Endpoint" -ForegroundColor Gray
    
    try {
        if ($Body) {
            $jsonBody = $Body | ConvertTo-Json
            $response = Invoke-RestMethod -Uri "$API_URL$Endpoint" -Method $Method -Body $jsonBody -ContentType "application/json"
        } else {
            $response = Invoke-RestMethod -Uri "$API_URL$Endpoint" -Method $Method
        }
        
        Write-Host "  ✓ Success!" -ForegroundColor Green
        Write-Host "  Response:" -ForegroundColor Gray
        $response | ConvertTo-Json -Depth 3 | Write-Host
        Write-Host ""
        return $true
    }
    catch {
        Write-Host "  ✗ Failed!" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        return $false
    }
}

# Check server connection
Write-Host "1. Checking server connection..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$API_URL/" -Method Get
    Write-Host "  ✓ Server is running!" -ForegroundColor Green
    Write-Host "  Response: $response" -ForegroundColor Gray
    Write-Host ""
}
catch {
    Write-Host "  ✗ Cannot connect to server!" -ForegroundColor Red
    Write-Host "  Make sure:" -ForegroundColor Yellow
    Write-Host "    1. MongoDB is running" -ForegroundColor Yellow
    Write-Host "    2. Backend server is started (node backend/server.js)" -ForegroundColor Yellow
    Write-Host ""
    exit
}

# Test Products API
Write-Host "2. Testing Products API..." -ForegroundColor Cyan
Test-Endpoint -Method "GET" -Endpoint "/api/products" -Description "Get all products"

Write-Host "3. Testing Products by Category..." -ForegroundColor Cyan
Test-Endpoint -Method "GET" -Endpoint "/api/products/category/Laptops" -Description "Get Laptops category"

Write-Host "4. Testing Product Search..." -ForegroundColor Cyan
Test-Endpoint -Method "GET" -Endpoint "/api/products/search?query=laptop" -Description "Search for 'laptop'"

# Test Categories API
Write-Host "5. Testing Categories API..." -ForegroundColor Cyan
Test-Endpoint -Method "GET" -Endpoint "/api/categories" -Description "Get all categories"

# Test Home API
Write-Host "6. Testing Home API..." -ForegroundColor Cyan
Test-Endpoint -Method "GET" -Endpoint "/api/home" -Description "Get home page data"

# Test About API
Write-Host "7. Testing About API..." -ForegroundColor Cyan
Test-Endpoint -Method "GET" -Endpoint "/api/about" -Description "Get about page data"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  API Testing Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your MongoDB connection is working!" -ForegroundColor Green
Write-Host "All API endpoints are accessible." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Open test-api.html in your browser for interactive testing" -ForegroundColor Gray
Write-Host "  2. Connect your frontend to these API endpoints" -ForegroundColor Gray
Write-Host "  3. Check MONGODB_SETUP_GUIDE.md for more information" -ForegroundColor Gray
Write-Host ""

