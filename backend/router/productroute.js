const express = require('express');
const router = express.Router();
const {
    getallproducts,
    getProductsByCategory,
    getproductById,
    createproduct,
    updateproduct,
    deleteproduct,
    searchProducts
} = require('../controllers/productscontroller');

// Get all products
router.get('/', getallproducts);

// Get products by category
router.get('/category/:category', getProductsByCategory);

// Get product by ID
router.get('/products/:id', getproductById);

// Get single product by ID (alternative route)
router.get('/product/:id', getproductById);

// Create new product
router.post('/products', createproduct);

// Update product
router.put('/products/:id', updateproduct);

// Delete product
router.delete('/products/:id', deleteproduct);

// Search products
router.get('/search', searchProducts);

// Get hot deals (random 6 products)
router.get('/deals', async (req, res) => {
    const productsModel = require('../models/productsmodel');
    try {
        const deals = await productsModel.aggregate([{ $sample: { size: 6 } }]);
        res.json({ deals });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching deals' });
    }
});

module.exports = router;





