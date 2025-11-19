// Quick script to check users in MongoDB
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String,
    fullName: String,
    phoneNumber: String,
    address: String,
    createdAt: Date
});

const User = mongoose.model('User', userSchema);

async function checkUsers() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/electronics_store');
        console.log('Connected to MongoDB');

        const users = await User.find().select('-password');
        console.log('\n=== USERS IN DATABASE ===');
        console.log(`Total users: ${users.length}\n`);

        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.username || 'No username'}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Role: ${user.role || 'user'}`);
            console.log(`   Full Name: ${user.fullName || 'N/A'}`);
            console.log(`   Created: ${user.createdAt || 'N/A'}`);
            console.log('');
        });

        await mongoose.connection.close();
        console.log('Connection closed');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkUsers();

