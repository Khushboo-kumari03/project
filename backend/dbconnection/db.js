const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/electronics_store', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
        console.log(`Database Name: ${conn.connection.name}`);
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        console.error('Full error:', error);
        console.log('Please ensure MongoDB is running on port 27017');
        process.exit(1);
    }
};

module.exports = connectDB;