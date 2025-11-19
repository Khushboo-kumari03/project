const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/usermodel');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/electronics_store', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function createAdminUser() {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });

        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log('Email: admin@gmail.com');
            console.log('Password: Admin@123');
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        // Create admin user
        const adminUser = new User({
            username: 'admin',
            fullName: 'System Administrator',
            email: 'admin@gmail.com',
            password: hashedPassword,
            phoneNumber: '9876543210',
            address: {
                state: 'Maharashtra',
                city: 'Mumbai',
                zipCode: '400001',
                country: 'India'
            },
            role: 'admin',
            isVerified: true
        });

        await adminUser.save();

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@gmail.com');
        console.log('🔑 Password: Admin@123');
        console.log('👤 Role: admin');
        console.log('');
        console.log('You can now login to the admin panel using these credentials.');

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    } finally {
        mongoose.connection.close();
    }
}

createAdminUser();
