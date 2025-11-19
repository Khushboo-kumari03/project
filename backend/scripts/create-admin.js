const mongoose = require('mongoose');
const User = require('../models/usermodel');
const connectDB = require('../dbconnection/db');

// Connect to MongoDB
connectDB();

async function createAdminUser() {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }
        
        // Create admin user
        const adminUser = new User({
            username: 'admin',
            email: 'admin@example.com',
            password: 'admin123',
            fullName: 'Admin User',
            phoneNumber: '1234567890',
            address: {
                street: '123 Admin St',
                city: 'Admin City',
                state: 'Admin State',
                zipCode: '12345',
                country: 'Admin Country'
            },
            role: 'admin'
        });
        
        await adminUser.save();
        
        console.log('Admin user created successfully');
        console.log('Email: admin@example.com');
        console.log('Password: admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser();
