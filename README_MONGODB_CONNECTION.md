# 🚀 MongoDB Connection & API Setup - Complete Guide

## ✅ What's Already Done

Your project is **fully configured** and ready to connect to MongoDB! Here's what you already have:

- ✅ Express.js backend server (`backend/server.js`)
- ✅ Mongoose ODM installed and configured
- ✅ Database connection module (`backend/dbconnection/db.js`)
- ✅ Complete API routes (products, cart, orders, auth, categories)
- ✅ MongoDB models (Products, Users, Cart, Orders, Categories)
- ✅ Controllers with CRUD operations
- ✅ Authentication middleware with JWT
- ✅ CORS enabled for frontend connections

## 🎯 Quick Start (3 Steps)

### Step 1: Install MongoDB

**Option A: Local Installation (Recommended for Development)**
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run the installer (install as Windows Service)
3. MongoDB will automatically start on `mongodb://127.0.0.1:27017`

**Option B: MongoDB Atlas (Cloud - Free Tier Available)**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free M0 cluster
3. Get your connection string
4. Update `.env` file with the connection string

### Step 2: Configure Environment

Copy the example environment file:
```bash
cd backend
copy .env.example .env
```

Edit `backend/.env` if needed (default settings work for local MongoDB).

### Step 3: Start the Server

**Option A: Using the batch file**
```bash
start-server.bat
```

**Option B: Manual start**
```bash
cd backend
node server.js
```

You should see:
```
Attempting to connect to MongoDB...
MongoDB Connected Successfully: 127.0.0.1
Database Name: electronics_store
Server is running on http://localhost:4001
```

## 🧪 Testing Your API

### Method 1: Interactive HTML Tester
Open `test-api.html` in your browser for a beautiful interactive API tester.

### Method 2: PowerShell Script
```powershell
.\test-api.ps1
```

### Method 3: Browser
Visit: http://localhost:4001/api/products

### Method 4: Frontend Example
Open `example-frontend-connection.html` to see products displayed with filtering and search.

## 📚 Available Files

| File | Purpose |
|------|---------|
| `MONGODB_SETUP_GUIDE.md` | Detailed setup instructions |
| `API_REFERENCE.md` | Complete API documentation |
| `test-api.html` | Interactive API tester (browser) |
| `test-api.ps1` | PowerShell API testing script |
| `example-frontend-connection.html` | Frontend connection example |
| `start-server.bat` | Quick server startup script |
| `backend/.env.example` | Environment variables template |

## 🔌 Your API Endpoints

### Base URL
```
http://localhost:4001
```

### Quick Reference

**Products**
- `GET /api/products` - Get all products
- `GET /api/products/category/:category` - Filter by category
- `GET /api/products/search?query=term` - Search products

**Authentication**
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

**Cart** (requires auth)
- `POST /api/cart/:userid/:productid` - Add to cart
- `GET /api/cart/:userid` - Get cart
- `PUT /api/cart/:id` - Update quantity
- `DELETE /api/cart/:id` - Remove item

**Orders** (requires auth)
- `POST /api/orders/:userid` - Place order
- `GET /api/orders/history/:userid` - Order history

**Categories**
- `GET /api/categories` - Get all categories

See `API_REFERENCE.md` for complete documentation.

## 💻 Frontend Connection Example

```javascript
// Fetch all products
const response = await fetch('http://localhost:4001/api/products');
const data = await response.json();
console.log(data.products);

// Add to cart (with authentication)
const token = localStorage.getItem('token');
const response = await fetch(`http://localhost:4001/api/cart/${userId}/${productId}`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ quantity: 1 })
});
```

## 🗄️ Database Structure

**Database Name:** `electronics_store`

**Collections:**
- `products` - Product catalog (auto-populated with sample data)
- `users` - User accounts
- `carts` - Shopping carts
- `orders` - Order history
- `categories` - Product categories

## 🔧 Troubleshooting

### Server won't start
1. Check if MongoDB is running:
   ```powershell
   Get-Service -Name MongoDB
   ```
2. Start MongoDB if needed:
   ```powershell
   Start-Service -Name MongoDB
   ```

### Connection refused
- Verify MongoDB is installed and running
- Check the connection string in `.env`
- For local: `mongodb://127.0.0.1:27017/electronics_store`
- For Atlas: Use the connection string from MongoDB Atlas

### Port 4001 already in use
Change the port in `backend/server.js` or kill the process:
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 4001).OwningProcess | Stop-Process
```

### No products showing
The app automatically creates sample products on first API call to `/api/products`

## 🎨 Sample Data

Your app includes automatic sample data creation for:
- 📱 Smartphones (iPhone, Samsung)
- 💻 Laptops (MacBook, Dell, Lenovo)
- 🎧 Audio (Sony, AirPods)
- 🖱️ Accessories (Mouse, Monitor)
- 🎮 Gaming (PlayStation, Nintendo)

## 🔐 Authentication Flow

1. User registers: `POST /api/auth/signup`
2. User logs in: `POST /api/auth/login`
3. Server returns JWT token
4. Frontend stores token in localStorage
5. Include token in subsequent requests:
   ```
   Authorization: Bearer <token>
   ```

## 📊 Next Steps

1. ✅ Install MongoDB
2. ✅ Start the server
3. ✅ Test with `test-api.html`
4. ✅ Connect your frontend
5. ✅ Build amazing features!

## 🆘 Need Help?

- Check `MONGODB_SETUP_GUIDE.md` for detailed setup
- Check `API_REFERENCE.md` for API documentation
- Open `test-api.html` to test endpoints interactively
- Run `test-api.ps1` for automated testing

## 🎉 You're All Set!

Your MongoDB connection is configured and ready to use. Just install MongoDB, start the server, and you're good to go!

Happy coding! 🚀

