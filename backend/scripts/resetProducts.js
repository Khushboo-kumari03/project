const mongoose = require('mongoose');
const Product = require('../models/productsmodel');

// MongoDB connection string - update this to match your database
const MONGODB_URI = 'mongodb://localhost:27017/electronics_store';

async function resetProducts() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Delete all existing products
        const deleteResult = await Product.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} existing products`);

        console.log('Products reset completed successfully!');
        console.log('Next time you access the API, new products with multiple images will be created.');
        
    } catch (error) {
        console.error('Error resetting products:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the reset
resetProducts();
