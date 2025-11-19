const mongoose = require('mongoose');
const Product = require('../models/productsmodel');

// MongoDB connection string - update this to match your database
const MONGODB_URI = 'mongodb://localhost:27017/electronics_store';

// ⭐ CUSTOMIZE THESE IMAGE URLs WITH YOUR OWN IMAGES ⭐
const customProductImages = [
  {
    productname: "Samsung Galaxy S24", // Must match exact product name in database
    images: [
      "https://your-image-1.jpg",  // Replace with your actual image URLs
      "https://your-image-2.jpg",
      "https://your-image-3.jpg", 
      "https://your-image-4.jpg"
    ]
  },
  {
    productname: "iPhone 15 Pro",
    images: [
      "https://your-iphone-1.jpg",
      "https://your-iphone-2.jpg",
      "https://your-iphone-3.jpg",
      "https://your-iphone-4.jpg"
    ]
  },
  {
    productname: "MacBook Pro M2",
    images: [
      "https://your-macbook-1.jpg",
      "https://your-macbook-2.jpg", 
      "https://your-macbook-3.jpg",
      "https://your-macbook-4.jpg"
    ]
  },
  {
    productname: "Sony WH-1000XM5",
    images: [
      "https://your-headphones-1.jpg",
      "https://your-headphones-2.jpg",
      "https://your-headphones-3.jpg",
      "https://your-headphones-4.jpg"
    ]
  },
  {
    productname: "PlayStation 5",
    images: [
      "https://your-ps5-1.jpg",
      "https://your-ps5-2.jpg",
      "https://your-ps5-3.jpg", 
      "https://your-ps5-4.jpg"
    ]
  }
  // Add more products as needed...
];

async function addCustomImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log('📝 Adding custom images to products...\n');

    let successCount = 0;
    let notFoundCount = 0;

    for (const productUpdate of customProductImages) {
      try {
        const result = await Product.updateOne(
          { productname: productUpdate.productname },
          { $set: { images: productUpdate.images } }
        );
        
        if (result.matchedCount > 0) {
          console.log(`✅ Updated "${productUpdate.productname}" with ${productUpdate.images.length} images`);
          successCount++;
        } else {
          console.log(`❌ Product not found: "${productUpdate.productname}"`);
          notFoundCount++;
        }
      } catch (error) {
        console.log(`❌ Error updating "${productUpdate.productname}":`, error.message);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`✅ Successfully updated: ${successCount} products`);
    console.log(`❌ Products not found: ${notFoundCount} products`);
    
    if (successCount > 0) {
      console.log('\n🎉 Custom images added successfully!');
      console.log('💡 Visit your product detail pages to see the new images.');
    }
    
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Function to list all products (helpful to see what products exist)
async function listAllProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('📋 Current products in database:\n');
    
    const products = await Product.find({}, 'productname category');
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.productname} (${product.category})`);
    });
    
    console.log(`\n📊 Total products: ${products.length}`);
    
  } catch (error) {
    console.error('Error listing products:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Check command line arguments
const command = process.argv[2];

if (command === 'list') {
  // Run: node addCustomImages.js list
  listAllProducts();
} else {
  // Run: node addCustomImages.js
  addCustomImages();
}

// Instructions for usage
if (!command) {
  console.log('\n📖 INSTRUCTIONS:');
  console.log('1. Edit this file and replace the image URLs with your own');
  console.log('2. Make sure product names match exactly with your database');
  console.log('3. Run: node addCustomImages.js');
  console.log('4. To see all products first: node addCustomImages.js list');
}
