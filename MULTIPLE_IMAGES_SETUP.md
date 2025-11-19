# Multiple Product Images Setup

## Overview
The e-commerce application now supports multiple images per product. Each product can have up to 4 different images that will be displayed in the product detail page gallery.

## Database Changes

### Product Schema Updates
- Added `images` field: An array of strings containing image URLs
- Kept existing `imageUrl` field for backward compatibility (used as main image)

### Sample Data
All sample products now include 4 different images:
1. Main product image
2. Different angle view
3. Close-up/detail view  
4. Packaging/accessories view

## How to Reset and Load New Products

### Option 1: Reset Database (Recommended)
```bash
cd backend
node scripts/resetProducts.js
```

### Option 2: Manual Database Reset
1. Connect to your MongoDB database
2. Delete all documents from the `products` collection:
   ```javascript
   db.products.deleteMany({})
   ```

### Load New Products
After resetting, simply make any API call to `/api/products` and the new sample products with multiple images will be automatically created.

## Frontend Changes

### Product Detail Page
- Now checks for `product.images` array first
- Falls back to generated images if no images array exists
- Displays 4 different thumbnails that users can click to view

### Image Display Logic
```javascript
// Use images from database or generate fallback images
const productImages = product.images && product.images.length > 0 
    ? product.images 
    : generateProductImages(product.imageUrl || product.image);
```

## API Changes

### Create Product
```json
{
    "productname": "Product Name",
    "price": 999.99,
    "description": "Product description",
    "category": "Category",
    "imageUrl": "https://main-image-url.com",
    "images": [
        "https://image1-url.com",
        "https://image2-url.com", 
        "https://image3-url.com",
        "https://image4-url.com"
    ],
    "stockQuantity": 10,
    "rating": 4.5
}
```

### Update Product
Same structure as create - include `images` array to update multiple images.

## Admin Panel Integration
The admin panel now supports:
- Creating products with multiple images
- Updating product image arrays
- Viewing all product images

## Image Categories
Sample images are organized by product category:
- **Laptops**: Various laptop models and angles
- **Smartphones**: Different phone models and views
- **Audio**: Headphones, speakers, earbuds
- **Gaming**: Consoles, controllers, accessories
- **Accessories**: Mice, monitors, keyboards

## Testing
1. Reset the database using the script
2. Visit any product detail page
3. Verify 4 different images appear in the thumbnail gallery
4. Click thumbnails to change the main image
5. Check that images are relevant to the product category

## Troubleshooting
- If you see duplicate images, the database hasn't been reset
- If images don't load, check the console for network errors
- Ensure MongoDB is running and accessible
- Verify the connection string in the reset script matches your database
