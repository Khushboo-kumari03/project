# MongoDB Setup and API Connection Guide

## 🎯 Your Project Status

Your project is **already configured** to work with MongoDB! You have:
- ✅ Express.js backend server
- ✅ Mongoose ODM installed
- ✅ Database connection file
- ✅ All API routes and controllers
- ✅ Product, Cart, Order, User models

## 📋 What You Need to Do

### Step 1: Install MongoDB

#### Option A: MongoDB Community Server (Local)
1. Download MongoDB from: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. During installation, install as a Windows Service (recommended)
4. MongoDB will run automatically on `mongodb://127.0.0.1:27017`

#### Option B: MongoDB Atlas (Cloud - Recommended for Production)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a free cluster (M0)
4. Get your connection string

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend` folder:

```env
# MongoDB Connection
MONGODB_URI=mongodb://127.0.0.1:27017/electronics_store
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/electronics_store

# Server Configuration
PORT=4001

# JWT Secret (for authentication)
JWT_SECRET=your_super_secret_key_change_this_in_production
```

### Step 3: Update Database Connection (Optional)

Your current connection is hardcoded. To use environment variables, update `backend/dbconnection/db.js`:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/electronics_store', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
        console.log(`Database Name: ${conn.connection.name}`);
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        console.error('Full error:', error);
        console.log('Please ensure MongoDB is running');
        process.exit(1);
    }
};

module.exports = connectDB;
```

### Step 4: Start Your Server

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

## 🚀 Your Available API Endpoints

### Products API
- `GET http://localhost:4001/api/products` - Get all products
- `GET http://localhost:4001/api/products/category/:category` - Get products by category
- `GET http://localhost:4001/api/products/product/:id` - Get single product
- `POST http://localhost:4001/api/products/products` - Create product
- `PUT http://localhost:4001/api/products/products/:id` - Update product
- `DELETE http://localhost:4001/api/products/products/:id` - Delete product
- `GET http://localhost:4001/api/products/search?query=laptop` - Search products

### Authentication API
- `POST http://localhost:4001/api/auth/signup` - Register user
- `POST http://localhost:4001/api/auth/login` - Login user
- `GET http://localhost:4001/api/auth/me` - Get current user (requires token)

### Cart API (Requires Authentication)
- `POST http://localhost:4001/api/cart/:userid/:productid` - Add to cart
- `GET http://localhost:4001/api/cart/:userid` - Get user's cart
- `PUT http://localhost:4001/api/cart/:id` - Update cart item
- `DELETE http://localhost:4001/api/cart/:id` - Remove from cart

### Orders API (Requires Authentication)
- `POST http://localhost:4001/api/orders/:userid` - Place order
- `GET http://localhost:4001/api/orders/history/:userid` - Get order history
- `PUT http://localhost:4001/api/orders/:id` - Update order
- `DELETE http://localhost:4001/api/orders/:id` - Delete order

### Categories API
- `GET http://localhost:4001/api/categories` - Get all categories
- `POST http://localhost:4001/api/categories` - Create category (admin only)

### Admin API (Requires Admin Authentication)
- `GET http://localhost:4001/api/admin/dashboard` - Get dashboard stats
- `GET http://localhost:4001/api/admin/users` - Get all users
- `GET http://localhost:4001/api/admin/products` - Get all products
- `GET http://localhost:4001/api/admin/orders` - Get all orders

## 🧪 Testing Your API

### Using Browser
Simply visit: `http://localhost:4001/api/products`

### Using PowerShell
```powershell
# Get all products
Invoke-RestMethod -Uri "http://localhost:4001/api/products" -Method Get

# Create a product
$body = @{
    productname = "Test Product"
    price = 99.99
    description = "Test Description"
    category = "Laptops"
    imageUrl = "https://example.com/image.jpg"
    stockQuantity = 10
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4001/api/products/products" -Method Post -Body $body -ContentType "application/json"
```

## 📊 Your MongoDB Database Structure

**Database Name:** `electronics_store`

**Collections:**
- `products` - Product catalog
- `users` - User accounts
- `carts` - Shopping carts
- `orders` - Order history
- `categories` - Product categories

## 🔧 Troubleshooting

### MongoDB Connection Failed
1. Check if MongoDB service is running:
   ```powershell
   Get-Service -Name MongoDB
   ```
2. Start MongoDB service:
   ```powershell
   Start-Service -Name MongoDB
   ```

### Port Already in Use
Change the port in `backend/server.js` or kill the process using port 4001

### Sample Data
Your app automatically creates sample products when you first call the products API!

## 📝 Next Steps

1. Install MongoDB
2. Create `.env` file
3. Start the server
4. Test the API endpoints
5. Your frontend can now connect to these APIs!

