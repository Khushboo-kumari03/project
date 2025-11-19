const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productname: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,

    },
    imageUrl: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: []
    },
    stockQuantity: {
        type: Number,
        required: true,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const productsModel = mongoose.model('Products', productSchema);

module.exports = productsModel;
