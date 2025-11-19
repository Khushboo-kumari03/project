require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');

        // Use environment variable or fallback to local MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/electronics_store';

        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
        console.log(`Database Name: ${conn.connection.name}`);
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        console.error('Full error:', error);
        console.log('Please ensure MongoDB is running');
        console.log('Local: mongodb://127.0.0.1:27017');
        console.log('Or set MONGODB_URI in .env file for cloud connection');
        process.exit(1);
    }
};

module.exports = connectDB;