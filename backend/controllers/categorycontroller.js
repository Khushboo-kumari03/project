const Category = require('../models/category');
const Product = require('../models/productsmodel');

// Add a new category
const addCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;

        // Validate input
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        // Check if category already exists
        const existingCategory = await Category.findOne({ name: name.toLowerCase() });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category already exists'
            });
        }

        // Create new category
        const category = new Category({
            name: name.toLowerCase(),
            description,
            image
        });

        // Save category
        await category.save();

        res.status(201).json(category);
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({
            message: 'Error adding category',
            error: error.message
        });
    }
};

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();

        // Get product counts for each category
        const categoriesWithCounts = await Promise.all(
            categories.map(async (category) => {
                const productCount = await Product.countDocuments({ category: category.name });
                return {
                    _id: category._id,
                    name: category.name,
                    description: category.description,
                    image: category.image,
                    createdAt: category.createdAt,
                    productCount
                };
            })
        );

        res.status(200).json(categoriesWithCounts);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            message: 'Error fetching categories',
            error: error.message
        });
    }
};

// Get category by ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({
            message: 'Error fetching category',
            error: error.message
        });
    }
};

// Update category
const updateCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;

        // Validate input
        if (!name) {
            return res.status(400).json({
                message: 'Category name is required'
            });
        }

        // Check if category exists
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        // Check if name is being changed and if it already exists
        if (name.toLowerCase() !== category.name && await Category.findOne({ name: name.toLowerCase() })) {
            return res.status(400).json({
                message: 'Category with this name already exists'
            });
        }

        // Update category
        category.name = name.toLowerCase();
        if (description) category.description = description;
        if (image) category.image = image;

        await category.save();

        // If category name changed, update all products with this category
        if (name.toLowerCase() !== category.name) {
            await Product.updateMany(
                { category: category.name },
                { category: name.toLowerCase() }
            );
        }

        res.status(200).json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({
            message: 'Error updating category',
            error: error.message
        });
    }
};

// Delete category
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        // Remove category from all products
        await Product.updateMany(
            { category: category.name },
            { category: 'uncategorized' }
        );

        // Delete category
        await Category.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({
            message: 'Error deleting category',
            error: error.message
        });
    }
};

module.exports = {
    addCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};