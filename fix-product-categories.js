// Fix product categories to lowercase
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productname: String,
    category: String,
    price: Number,
    description: String,
    imageurl: String,
    stockquantity: Number,
    rating: Number
});

const Product = mongoose.model('Product', productSchema);

async function fixCategories() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/electronics_store');
        console.log('✅ Connected to MongoDB\n');

        const products = await Product.find();
        console.log(`📦 Found ${products.length} products\n`);

        let updated = 0;

        for (const product of products) {
            const oldCategory = product.category;
            const newCategory = oldCategory.toLowerCase();

            if (oldCategory !== newCategory) {
                product.category = newCategory;
                await product.save();
                console.log(`✅ Updated: ${product.productname}`);
                console.log(`   '${oldCategory}' → '${newCategory}'`);
                updated++;
            } else {
                console.log(`⏭️  Skipped: ${product.productname} (already lowercase)`);
            }
        }

        console.log(`\n📊 Summary:`);
        console.log(`   Updated: ${updated} products`);
        console.log(`   Skipped: ${products.length - updated} products`);

        // Verify the fix
        console.log('\n🔍 Verification:\n');
        const allProducts = await Product.find();
        const categoryCount = {};

        allProducts.forEach(p => {
            categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
        });

        console.log('   Category distribution:');
        Object.entries(categoryCount).forEach(([cat, count]) => {
            console.log(`   - ${cat}: ${count} products`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Connection closed');
        console.log('\n🎉 Product categories fixed!');
        console.log('   Refresh your admin panel to see the categories with product counts.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fixCategories();

