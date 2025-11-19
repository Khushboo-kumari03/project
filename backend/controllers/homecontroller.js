const productsModel = require('../models/productsmodel');

// Get home page data
const getHomeData = async (req, res) => {
    try {
        // Get all products
        const products = await productsModel.find().limit(8);
        
        // Get categories
        const categories = await productsModel.distinct('category');

        res.status(200).json({
            success: true,
            message: 'Home page data fetched successfully',
            data: {
                products,
                categories
            }
        });
    } catch (error) {
        console.error('Error fetching home data:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching home page data' 
        });
    }
};

module.exports = {
    getHomeData
}; 