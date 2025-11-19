// Script to create an admin user
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: { type: String, default: 'user' },
    fullName: String,
    phoneNumber: String,
    address: String,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createAdminUser() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/electronics_store');
        console.log('✅ Connected to MongoDB\n');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log(`   Email: ${existingAdmin.email}`);
            console.log(`   Username: ${existingAdmin.username}`);
            console.log(`   Role: ${existingAdmin.role}`);
            
            // Update to admin role if not already
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('\n✅ Updated existing user to admin role');
            }
        } else {
            // Create new admin user
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            const adminUser = new User({
                username: 'admin',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'admin',
                fullName: 'System Administrator',
                phoneNumber: '1234567890',
                address: 'Admin Office',
                createdAt: new Date()
            });

            await adminUser.save();
            console.log('✅ Admin user created successfully!\n');
            console.log('📧 Email: admin@example.com');
            console.log('🔑 Password: admin123');
            console.log('👤 Username: admin');
            console.log('🎭 Role: admin');
        }

        // Show all users
        const allUsers = await User.find().select('-password');
        console.log(`\n📊 Total users in database: ${allUsers.length}\n`);
        
        allUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.username} (${user.email})`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Full Name: ${user.fullName || 'N/A'}`);
            console.log('');
        });

        await mongoose.connection.close();
        console.log('✅ Connection closed');
        console.log('\n🎉 You can now login to the admin panel with:');
        console.log('   Email: admin@example.com');
        console.log('   Password: admin123');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createAdminUser();

