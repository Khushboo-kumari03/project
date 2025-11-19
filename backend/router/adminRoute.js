const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middleware/admin');

// Apply admin middleware to all routes
router.use(adminMiddleware);

// Dashboard routes
router.get('/dashboard', adminController.getDashboardStats);

// User routes
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Product routes
router.get('/products', adminController.getAllProducts);
router.get('/products/:id', adminController.getProductById);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Order routes
router.get('/orders', adminController.getAllOrders);
router.get('/orders/:id', adminController.getOrderById);
router.put('/orders/:id/status', adminController.updateOrderStatus);

module.exports = router;
