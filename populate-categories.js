// Script to populate categories from existing products
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: String,
    image: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const productSchema = new mongoose.Schema({
    productname: String,
    category: String,
    price: Number,
    description: String,
    imageurl: String,
    stockquantity: Number,
    rating: Number
});

const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);

async function populateCategories() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/electronics_store');
        console.log('✅ Connected to MongoDB\n');

        // Get all unique categories from products
        const products = await Product.find();
        const uniqueCategories = [...new Set(products.map(p => p.category).filter(c => c))];

        console.log(`📦 Found ${products.length} products`);
        console.log(`📂 Found ${uniqueCategories.length} unique categories:\n`);

        // Category descriptions
        const categoryDescriptions = {
            'laptops': 'High-performance laptops for work and gaming',
            'smartphones': 'Latest smartphones with cutting-edge technology',
            'audio': 'Premium audio equipment and headphones',
            'accessories': 'Essential tech accessories and peripherals',
            'gaming': 'Gaming consoles and entertainment systems'
        };

        // Category images
        const categoryImages = {
            'laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
            'smartphones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
            'audio': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
            'accessories': 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400',
            'gaming': 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=400'
        };

        // Create or update categories
        let created = 0;
        let existing = 0;

        for (const categoryName of uniqueCategories) {
            const normalizedName = categoryName.toLowerCase();
            
            const existingCategory = await Category.findOne({ name: normalizedName });
            
            if (existingCategory) {
                console.log(`⚠️  Category already exists: ${normalizedName}`);
                existing++;
            } else {
                const newCategory = new Category({
                    name: normalizedName,
                    description: categoryDescriptions[normalizedName] || `Products in ${categoryName} category`,
                    image: categoryImages[normalizedName] || '',
                    createdAt: new Date()
                });

                await newCategory.save();
                console.log(`✅ Created category: ${normalizedName}`);
                created++;
            }
        }

        console.log(`\n📊 Summary:`);
        console.log(`   Created: ${created} categories`);
        console.log(`   Already existed: ${existing} categories`);

        // Show all categories with product counts
        const allCategories = await Category.find();
        console.log(`\n📂 All Categories in Database:\n`);

        for (const cat of allCategories) {
            const productCount = await Product.countDocuments({ category: cat.name });
            console.log(`   ${cat.name} - ${productCount} products`);
        }

        await mongoose.connection.close();
        console.log('\n✅ Connection closed');
        console.log('\n🎉 Categories populated successfully!');
        console.log('   Refresh your admin panel to see the categories.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

populateCategories();

