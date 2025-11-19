# How to Add 4 Unique Images to MongoDB Products

## Method 1: Using MongoDB Compass (Recommended for Beginners)

### Step 1: Open MongoDB Compass
1. Download and install MongoDB Compass if you haven't already
2. Connect to your database: `mongodb://localhost:27017`
3. Navigate to `electronics_store` database → `products` collection

### Step 2: Edit a Product
1. Find the product you want to update
2. Click the pencil icon (Edit Document)
3. Add the `images` field with your 4 image URLs:

```json
{
  "_id": ObjectId("..."),
  "productname": "Samsung Galaxy S24",
  "price": 899.99,
  "description": "Flagship Android phone",
  "category": "Smartphones",
  "imageUrl": "https://your-main-image.jpg",
  "images": [
    "https://your-image-1.jpg",
    "https://your-image-2.jpg", 
    "https://your-image-3.jpg",
    "https://your-image-4.jpg"
  ],
  "stockQuantity": 25,
  "rating": 4.8
}
```

4. Click "Update" to save

## Method 2: Using MongoDB Shell Commands

### Update Single Product
```javascript
// Connect to your database
use electronics_store

// Update a specific product by name
db.products.updateOne(
  { "productname": "Samsung Galaxy S24" },
  { 
    $set: { 
      "images": [
        "https://your-image-1.jpg",
        "https://your-image-2.jpg",
        "https://your-image-3.jpg", 
        "https://your-image-4.jpg"
      ]
    }
  }
)
```

### Update Multiple Products at Once
```javascript
// Update iPhone
db.products.updateOne(
  { "productname": "iPhone 15 Pro" },
  { 
    $set: { 
      "images": [
        "https://iphone-front.jpg",
        "https://iphone-back.jpg",
        "https://iphone-side.jpg",
        "https://iphone-box.jpg"
      ]
    }
  }
)

// Update MacBook
db.products.updateOne(
  { "productname": "MacBook Pro M2" },
  { 
    $set: { 
      "images": [
        "https://macbook-open.jpg",
        "https://macbook-closed.jpg",
        "https://macbook-side.jpg",
        "https://macbook-ports.jpg"
      ]
    }
  }
)
```

## Method 3: Using Node.js Script

### Create Update Script
```javascript
// backend/scripts/updateProductImages.js
const mongoose = require('mongoose');
const Product = require('../models/productsmodel');

const MONGODB_URI = 'mongodb://localhost:27017/electronics_store';

const productUpdates = [
  {
    productname: "Samsung Galaxy S24",
    images: [
      "https://your-samsung-front.jpg",
      "https://your-samsung-back.jpg", 
      "https://your-samsung-side.jpg",
      "https://your-samsung-box.jpg"
    ]
  },
  {
    productname: "iPhone 15 Pro", 
    images: [
      "https://your-iphone-front.jpg",
      "https://your-iphone-back.jpg",
      "https://your-iphone-side.jpg", 
      "https://your-iphone-accessories.jpg"
    ]
  }
  // Add more products...
];

async function updateProductImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const update of productUpdates) {
      const result = await Product.updateOne(
        { productname: update.productname },
        { $set: { images: update.images } }
      );
      
      if (result.matchedCount > 0) {
        console.log(`✅ Updated ${update.productname}`);
      } else {
        console.log(`❌ Product not found: ${update.productname}`);
      }
    }

    console.log('All updates completed!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

updateProductImages();
```

### Run the Script
```bash
cd backend
node scripts/updateProductImages.js
```

## Method 4: Using Admin Panel API

### Create Product with Images via API
```javascript
// POST to http://localhost:4001/api/admin/products
{
  "productname": "Your Product Name",
  "price": 999.99,
  "description": "Product description",
  "category": "Smartphones",
  "imageUrl": "https://main-image.jpg",
  "images": [
    "https://image-1.jpg",
    "https://image-2.jpg", 
    "https://image-3.jpg",
    "https://image-4.jpg"
  ],
  "stockQuantity": 10,
  "rating": 4.5
}
```

### Update Existing Product via API
```javascript
// PUT to http://localhost:4001/api/admin/products/{productId}
{
  "images": [
    "https://new-image-1.jpg",
    "https://new-image-2.jpg",
    "https://new-image-3.jpg", 
    "https://new-image-4.jpg"
  ]
}
```

## Image URL Sources

### Free Image Sources:
1. **Unsplash**: `https://images.unsplash.com/photo-{id}?w=500&h=400&fit=crop`
2. **Pexels**: `https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg`
3. **Pixabay**: `https://pixabay.com/get/{id}.jpg`

### Your Own Images:
1. Upload to cloud storage (AWS S3, Cloudinary, etc.)
2. Use the public URLs
3. Ensure images are accessible via HTTPS

## Example with Real Image URLs

```json
{
  "productname": "Samsung Galaxy S24",
  "images": [
    "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=400&fit=crop",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=400&fit=crop",
    "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&h=400&fit=crop",
    "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&h=400&fit=crop"
  ]
}
```

## Verification

### Check if Images Were Added
```javascript
// In MongoDB shell
db.products.findOne(
  { "productname": "Samsung Galaxy S24" },
  { "productname": 1, "images": 1 }
)
```

### Test in Frontend
1. Visit product detail page
2. Check if 4 different thumbnails appear
3. Click each thumbnail to verify different images load

## Tips
- Use consistent image dimensions (500x400 recommended)
- Ensure all URLs are HTTPS
- Test image URLs in browser before adding to database
- Keep image file sizes reasonable for fast loading
- Use descriptive filenames for better organization
