const express = require('express');
const router = express.Router();
const {
    addCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/categorycontroller');
const adminMiddleware = require('../middleware/admin');

// Get all categories (public)
router.get('/', getCategories);

// Get category by ID (public)
router.get('/:id', getCategoryById);

// Admin routes (protected)
// Add a new category
router.post('/add', adminMiddleware, addCategory);
router.post('/', adminMiddleware, addCategory); // Alternative endpoint

// Update category
router.put('/:id', adminMiddleware, updateCategory);

// Delete category
router.delete('/:id', adminMiddleware, deleteCategory);

module.exports = router;