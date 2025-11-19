const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const adminAuth = require('../middleware/adminAuth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Admin login
router.post('/auth/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        const token = jwt.sign(
            { adminId: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: admin._id,
                email: admin.email,
                username: admin.username,
                fullName: admin.fullName,
                role: admin.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get dashboard statistics
router.get('/admin/dashboard/stats', adminAuth, async (req, res) => {
    try {
        const totalSales = await Order.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        res.json({
            totalSales: totalSales[0]?.total || 0,
            totalOrders,
            totalUsers,
            totalProducts
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get recent orders
router.get('/orders/recent', adminAuth, async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'email')
            .populate('items.product', 'name');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update order status
router.put('/orders/:id', adminAuth, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete order
router.delete('/orders/:id', adminAuth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await order.remove();
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all products
router.get('/products', adminAuth, async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 