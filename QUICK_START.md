# ⚡ Quick Start Guide - MongoDB & API Connection

## 🎯 Your Project is Ready!

Everything is already configured. You just need to:
1. Install MongoDB
2. Start the server
3. Test the API

---

## 📥 Step 1: Install MongoDB (5 minutes)

### Windows Installation
1. Go to: https://www.mongodb.com/try/download/community
2. Download **MongoDB Community Server**
3. Run installer → Choose "Complete" installation
4. ✅ Check "Install MongoDB as a Service"
5. ✅ Check "Install MongoDB Compass" (optional GUI)
6. Click Install

**That's it!** MongoDB will run automatically on `mongodb://127.0.0.1:27017`

---

## 🚀 Step 2: Start Your Server (30 seconds)

### Option A: Double-click the batch file
```
start-server.bat
```

### Option B: Use command line
```bash
cd backend
node server.js
```

### ✅ Success looks like:
```
Attempting to connect to MongoDB...
MongoDB Connected Successfully: 127.0.0.1
Database Name: electronics_store
Server is running on http://localhost:4001
```

---

## 🧪 Step 3: Test Your API (1 minute)

### Method 1: Open the HTML Tester
Double-click: `test-api.html`

### Method 2: Visit in Browser
http://localhost:4001/api/products

### Method 3: Run PowerShell Script
```powershell
.\test-api.ps1
```

---

## 🎉 You're Done!

Your MongoDB is connected and API is working!

---

## 📋 What You Have Now

### ✅ Working API Endpoints

**Products**
```
GET  http://localhost:4001/api/products
GET  http://localhost:4001/api/products/category/Laptops
GET  http://localhost:4001/api/products/search?query=laptop
```

**Authentication**
```
POST http://localhost:4001/api/auth/signup
POST http://localhost:4001/api/auth/login
```

**Cart** (requires login)
```
POST http://localhost:4001/api/cart/:userid/:productid
GET  http://localhost:4001/api/cart/:userid
```

**Orders** (requires login)
```
POST http://localhost:4001/api/orders/:userid
GET  http://localhost:4001/api/orders/history/:userid
```

### ✅ Sample Data
Your database automatically includes:
- 📱 Smartphones (iPhone, Samsung)
- 💻 Laptops (MacBook, Dell, Lenovo)
- 🎧 Audio devices (Sony, AirPods)
- 🖱️ Accessories (Mouse, Monitor)
- 🎮 Gaming consoles (PS5, Nintendo)

---

## 💻 Connect Your Frontend

### Simple Example
```javascript
// Get all products
fetch('http://localhost:4001/api/products')
    .then(response => response.json())
    .then(data => {
        console.log(data.products);
        // Display products in your UI
    });
```

### With Authentication
```javascript
// Login first
const loginResponse = await fetch('http://localhost:4001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'user@example.com',
        password: 'password123'
    })
});

const { token } = await loginResponse.json();
localStorage.setItem('token', token);

// Then use token for protected routes
const cartResponse = await fetch(`http://localhost:4001/api/cart/${userId}`, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
```

---

## 🔧 Troubleshooting

### ❌ "Cannot connect to MongoDB"
**Solution:** Start MongoDB service
```powershell
Start-Service -Name MongoDB
```

### ❌ "Port 4001 already in use"
**Solution:** Kill the process or change port in `backend/server.js`

### ❌ "MongoDB not installed"
**Solution:** Follow Step 1 above

---

## 📚 More Information

- **Complete Setup Guide:** `MONGODB_SETUP_GUIDE.md`
- **API Documentation:** `API_REFERENCE.md`
- **Interactive Tester:** `test-api.html`
- **Frontend Example:** `example-frontend-connection.html`

---

## 🎯 Next Steps

1. ✅ MongoDB installed and running
2. ✅ Server started successfully
3. ✅ API tested and working
4. 🚀 **Now:** Connect your frontend!
5. 🚀 **Then:** Build amazing features!

---

## 💡 Pro Tips

- Use `test-api.html` for quick API testing
- Check `API_REFERENCE.md` for all endpoints
- Sample data is created automatically
- JWT tokens expire - handle re-authentication
- Use MongoDB Compass to view your database visually

---

## 🆘 Still Need Help?

1. Open `test-api.html` - it shows connection status
2. Check if MongoDB service is running
3. Verify server is running on port 4001
4. Check `backend/.env` file exists

---

**You're all set! Happy coding! 🚀**

