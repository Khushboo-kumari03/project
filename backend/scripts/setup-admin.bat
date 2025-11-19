@echo off
echo Creating admin user...
node scripts/create-admin.js
echo.
echo Admin user created successfully!
echo.
echo Admin credentials:
echo Email: admin@example.com
echo Password: admin123
echo.
echo You can now log in to the admin panel at http://localhost:5510/frontend/admin/login.html
echo.
pause
