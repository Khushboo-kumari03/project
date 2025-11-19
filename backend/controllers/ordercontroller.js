const orderModel = require('../models/ordermodel');
const userModel = require('../models/usermodel');
const productModel = require('../models/productsmodel');
const cartModel = require('../models/cartmodel');
const mongoose = require('mongoose');

async function placeorder(req, res) {
    try {
        const userid = req.params.userid;

        // Validate userid format
        if (!mongoose.Types.ObjectId.isValid(userid)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid user ID format' 
            });
        }

        const { productids, shippingaddress, paymentmethod } = req.body;

        // Validate required fields
        if (!productids || !Array.isArray(productids) || productids.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Product items are required and must be an array' 
            });
        }

        if (!shippingaddress || shippingaddress.trim() === '') {
            return res.status(400).json({ 
                success: false,
                message: 'Shipping address is required' 
            });
        }

        // Check if the user exists
        const user = await userModel.findById(userid);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Calculate total price and validate products
        let totalprice = 0;
        const orderItems = [];

        for (const item of productids) {
            // Validate product ID format
            if (!mongoose.Types.ObjectId.isValid(item.productid)) {
                return res.status(400).json({ 
                    success: false,
                    message: `Invalid product ID format: ${item.productid}` 
                });
            }

            if (!item.quantity || item.quantity < 1) {
                return res.status(400).json({ 
                    success: false,
                    message: `Invalid quantity for product: ${item.productid}` 
                });
            }

            const product = await productModel.findById(item.productid);
            if (!product) {
                return res.status(404).json({ 
                    success: false,
                    message: `Product not found: ${item.productid}` 
                });
            }

            // Check stock availability
            if (product.stockQuantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product: ${product.productname}. Available: ${product.stockQuantity}`
                });
            }

            totalprice += product.price * item.quantity;
            orderItems.push({
                productid: item.productid,
                quantity: item.quantity
            });

            // Update product stock
            product.stockQuantity -= item.quantity;
            await product.save();
        }

        // Create new order
        const newOrder = new orderModel({
            userid,
            productids: orderItems,
            shippingaddress,
            totalprice,
            paymentmethod: paymentmethod || 'cod',
            status: 'pending',
            paymentstatus: 'pending',
            orderdate: new Date(),
            deliverydate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        });

        await newOrder.save();

        // Clear user's cart after successful order
        await cartModel.deleteMany({ userid });

        return res.status(200).json({
            success: true,
            message: 'Order placed successfully',
            order: newOrder
        });
    } catch (error) {
        console.error('Error placing order:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

async function getorders(req, res) {
    try {
        const orders = await orderModel.find()
            .populate('userid', 'username email')
            .populate('productids.productid', 'productname price imageUrl');

        return res.status(200).json({
            message: 'Orders fetched successfully',
            orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}

async function userorderhistory(req, res) {
    try {
        const userid = req.params.userid;

        if (!mongoose.Types.ObjectId.isValid(userid)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        const orders = await orderModel.find({ userid })
            .populate('productids.productid', 'productname price imageUrl')
            .sort({ orderdate: -1 });

        return res.status(200).json({
            message: 'Orders fetched successfully',
            orders
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}

async function updateorder(req, res) {
    try {
        const orderid = req.params.id;
        
        if (!mongoose.Types.ObjectId.isValid(orderid)) {
            return res.status(400).json({ message: 'Invalid order ID format' });
        }

        const order = await orderModel.findByIdAndUpdate(
            orderid,
            { $set: req.body },
            { new: true }
        ).populate('productids.productid', 'productname price imageUrl');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json({
            message: 'Order updated successfully',
            order
        });
    } catch (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}

async function deleteorder(req, res) {
    try {
        const orderid = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(orderid)) {
            return res.status(400).json({ message: 'Invalid order ID format' });
        }

        const order = await orderModel.findByIdAndDelete(orderid);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json({
            message: 'Order deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting order:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}

module.exports = {
    placeorder,
    getorders,
    userorderhistory,
    updateorder,
    deleteorder
};
