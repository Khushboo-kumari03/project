# 📚 API Reference - Electronics Store

Base URL: `http://localhost:4001`

## 🔐 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 👤 Authentication Endpoints

### Register User
```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "username": "john_doe"
  }
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

## 📦 Products Endpoints

### Get All Products
```http
GET /api/products
```

**Response:**
```json
{
  "products": [
    {
      "_id": "product_id",
      "productname": "MacBook Pro M2",
      "price": 1299.99,
      "description": "Latest MacBook Pro with M2 chip",
      "category": "Laptops",
      "imageUrl": "https://...",
      "images": ["url1", "url2", "url3"],
      "stockQuantity": 10,
      "rating": 4.8
    }
  ]
}
```

### Get Products by Category
```http
GET /api/products/category/:category
```

Example: `GET /api/products/category/Laptops`

### Get Single Product
```http
GET /api/products/product/:id
```

### Search Products
```http
GET /api/products/search?query=laptop
```

### Create Product (Admin)
```http
POST /api/products/products
Content-Type: application/json

{
  "productname": "New Product",
  "price": 999.99,
  "description": "Product description",
  "category": "Laptops",
  "imageUrl": "https://example.com/image.jpg",
  "images": ["url1", "url2"],
  "stockQuantity": 10,
  "rating": 4.5
}
```

### Update Product (Admin)
```http
PUT /api/products/products/:id
Content-Type: application/json

{
  "price": 899.99,
  "stockQuantity": 15
}
```

### Delete Product (Admin)
```http
DELETE /api/products/products/:id
```

---

## 🛒 Cart Endpoints (Requires Authentication)

### Add to Cart
```http
POST /api/cart/:userid/:productid
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 2
}
```

### Get User's Cart
```http
GET /api/cart/:userid
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "carts": [
    {
      "_id": "cart_id",
      "userid": "user_id",
      "productid": {
        "_id": "product_id",
        "productname": "MacBook Pro M2",
        "price": 1299.99,
        "imageUrl": "https://..."
      },
      "quantity": 2
    }
  ],
  "summary": {
    "totalItems": 2,
    "totalPrice": 2599.98
  }
}
```

### Update Cart Item
```http
PUT /api/cart/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

### Remove from Cart
```http
DELETE /api/cart/:id
Authorization: Bearer <token>
```

---

## 📋 Orders Endpoints (Requires Authentication)

### Place Order
```http
POST /api/orders/:userid
Authorization: Bearer <token>
Content-Type: application/json

{
  "productids": [
    {
      "productid": "product_id_1",
      "quantity": 2
    },
    {
      "productid": "product_id_2",
      "quantity": 1
    }
  ],
  "shippingaddress": "123 Main St, City, Country",
  "paymentmethod": "cod"
}
```

### Get Order History
```http
GET /api/orders/history/:userid
Authorization: Bearer <token>
```

### Update Order
```http
PUT /api/orders/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "shipped"
}
```

### Delete Order
```http
DELETE /api/orders/:id
Authorization: Bearer <token>
```

---

## 📂 Categories Endpoints

### Get All Categories
```http
GET /api/categories
```

### Get Category by ID
```http
GET /api/categories/:id
```

### Create Category (Admin)
```http
POST /api/categories
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Tablets",
  "description": "Tablet devices"
}
```

---

## 🏠 Other Endpoints

### Home Page Data
```http
GET /api/home
```

### About Page Data
```http
GET /api/about
```

---

## 🔧 Admin Endpoints (Requires Admin Authentication)

### Dashboard Stats
```http
GET /api/admin/dashboard
Authorization: Bearer <admin_token>
```

### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <admin_token>
```

### Get All Orders
```http
GET /api/admin/orders
Authorization: Bearer <admin_token>
```

---

## 📊 Response Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## 💡 Usage Examples

### JavaScript/Fetch
```javascript
// Get all products
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

### PowerShell
```powershell
# Get all products
Invoke-RestMethod -Uri "http://localhost:4001/api/products" -Method Get

# Login
$body = @{
    email = "user@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4001/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```

