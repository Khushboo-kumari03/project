const productsModel = require('../models/productsmodel');

// Get products by category
const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await productsModel.find({
            category: { $regex: `^${category.trim()}$`, $options: 'i' }
        });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: `No products found in ${category} category` });
        }

        res.status(200).json({ products });
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ message: 'Error fetching products by category' });
    }
};

// Create sample products if none exist
const createSampleProducts = async () => {
    try {
        const sampleProducts = [
            // Laptops
            {
                productname: "MacBook Pro M2",
                price: 1299.99,
                description: "Latest MacBook Pro with M2 chip, 16GB RAM, 512GB SSD",
                category: "Laptops",
                imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
                images: [
                    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
                    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
                    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2",
                    "https://images.unsplash.com/photo-1484788984921-03950022c9ef"
                ],
                stockQuantity: 10,
                rating: 4.8
            },
            {
                productname: "Dell XPS 13",
                price: 999.99,
                description: "Premium ultrabook with InfinityEdge display",
                category: "Laptops",
                imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
                images: [
                    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
                    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef",
                    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed",
                    "https://images.unsplash.com/photo-1603302576837-37561b2e2302"
                ],
                stockQuantity: 15,
                rating: 4.6
            },
            {
                productname: "Lenovo ThinkPad X1",
                price: 1199.99,
                description: "Business laptop with military-grade durability",
                category: "Laptops",
                imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
                images: [
                    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
                    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed",
                    "https://images.unsplash.com/photo-1603302576837-37561b2e2302",
                    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2"
                ],
                stockQuantity: 8,
                rating: 4.7
            },
            // Smartphones
            {
                productname: "iPhone 15 Pro",
                price: 999.99,
                description: "Latest iPhone with A17 Pro chip and titanium design",
                category: "Smartphones",
                imageUrl: "https://images.unsplash.com/photo-1592286927505-1def25115558",
                images: [
                    "https://images.unsplash.com/photo-1592286927505-1def25115558",
                    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
                    "https://images.unsplash.com/photo-1580910051074-3eb694886505",
                    "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb"
                ],
                stockQuantity: 20,
                rating: 4.9
            },
            {
                productname: "Samsung Galaxy S23 Ultra",
                price: 899.99,
                description: "Premium Android flagship with S Pen",
                category: "Smartphones",
                imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c",
                images: [
                    "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c",
                    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab",
                    "https://images.unsplash.com/photo-1565849904461-04a58ad377e0",
                    "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2"
                ],
                stockQuantity: 15,
                rating: 4.7
            },
            // Audio
            {
                productname: "Sony WH-1000XM5",
                price: 399.99,
                description: "Premium noise-cancelling headphones",
                category: "Audio",
                imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
                images: [
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
                    "https://images.unsplash.com/photo-1583394838336-acd977736f90",
                    "https://images.unsplash.com/photo-1484704849700-f032a568e944",
                    "https://images.unsplash.com/photo-1545454675-3531b543be5d"
                ],
                stockQuantity: 12,
                rating: 4.8
            },
            {
                productname: "Apple AirPods Pro",
                price: 249.99,
                description: "Wireless earbuds with active noise cancellation",
                category: "Audio",
                imageUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434",
                images: [
                    "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434",
                    "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb",
                    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
                    "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1"
                ],
                stockQuantity: 25,
                rating: 4.6
            },
            // Accessories
            {
                productname: "Logitech MX Master 3S",
                price: 99.99,
                description: "Premium wireless mouse for productivity",
                category: "Accessories",
                imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db",
                images: [
                    "https://images.unsplash.com/photo-1527814050087-3793815479db",
                    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7",
                    "https://images.unsplash.com/photo-1563297007-0686b7003af7",
                    "https://images.unsplash.com/photo-1586953208448-b95a79798f07"
                ],
                stockQuantity: 30,
                rating: 4.7
            },
            {
                productname: "Samsung 49\" Odyssey G9",
                price: 999.99,
                description: "Ultra-wide gaming monitor with 240Hz refresh rate",
                category: "Accessories",
                imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf",
                images: [
                    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf",
                    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43",
                    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
                    "https://images.unsplash.com/photo-1441986300917-64674bd600d8"
                ],
                stockQuantity: 5,
                rating: 4.9
            },
            // Gaming
            {
                productname: "PlayStation 5",
                price: 499.99,
                description: "Next-gen gaming console with DualSense controller",
                category: "Gaming",
                imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
                images: [
                    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
                    "https://images.unsplash.com/photo-1542751371-adc38448a05e",
                    "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8",
                    "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3"
                ],
                stockQuantity: 8,
                rating: 4.9
            },
            {
                productname: "Nintendo Switch OLED",
                price: 349.99,
                description: "Handheld gaming console with OLED display",
                category: "Gaming",
                imageUrl: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e",
                images: [
                    "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e",
                    "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae",
                    "https://images.unsplash.com/photo-1551103782-8ab07afd45c1",
                    "https://images.unsplash.com/photo-1486401899868-0e435ed85128"
                ],
                stockQuantity: 15,
                rating: 4.8
            }
        ];

        // Check if we need to add products for each category
        for (const category of ["Laptops", "Smartphones", "Audio", "Accessories", "Gaming"]) {
            const existingProducts = await productsModel.find({ category });
            if (existingProducts.length === 0) {
                const categoryProducts = sampleProducts.filter(p => p.category === category);
                await productsModel.insertMany(categoryProducts);
                console.log(`Sample ${category} products created`);
            }
        }
    } catch (error) {
        console.error('Error creating sample products:', error);
    }
};

// Get all products
const getallproducts = async (req, res) => {
    try {
        await createSampleProducts(); // Create sample products if none exist
        const products = await productsModel.find();
        res.status(200).json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
};

// Get product by ID
const getproductById = async (req, res) => {
    try {
        const product = await productsModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new product
const createproduct = async (req, res) => {
    try {
        const newProduct = new productsModel(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update product
const updateproduct = async (req, res) => {
    try {
        const updatedProduct = await productsModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete product
const deleteproduct = async (req, res) => {
    try {
        const deletedProduct = await productsModel.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search products
const searchProducts = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const searchRegex = new RegExp(query.trim(), 'i');

        const products = await productsModel.find({
            $or: [
                { productname: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
                { category: { $regex: searchRegex } }
            ]
        }).sort({ productname: 1 }); // Sort by product name

        res.json({
            products,
            searchTerm: query.trim(),
            resultCount: products.length
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Error searching products' });
    }
};

// Export the functions
module.exports = {
    getallproducts,
    getProductsByCategory,
    createSampleProducts,
    getproductById,
    createproduct,
    updateproduct,
    deleteproduct,
    searchProducts
};

