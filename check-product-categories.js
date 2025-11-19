// Check product categories
const mongoose = require('mongoose');

async function checkCategories() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/electronics_store');
        console.log('✅ Connected to MongoDB\n');

        const products = await mongoose.connection.db.collection('products').find().toArray();
        
        console.log('📦 Product Categories:\n');
        products.forEach(p => {
            console.log(`   ${p.productname}: '${p.category}' (type: ${typeof p.category})`);
        });

        const categories = await mongoose.connection.db.collection('categories').find().toArray();
        console.log('\n📂 Categories in Database:\n');
        categories.forEach(c => {
            console.log(`   '${c.name}' (type: ${typeof c.name})`);
        });

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkCategories();

