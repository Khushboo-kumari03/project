const User = require('../models/usermodel');
const Product = require('../models/productsmodel');
const Order = require('../models/ordermodel');
const Category = require('../models/category');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        // Get counts
        const userCount = await User.countDocuments();
        const productCount = await Product.countDocuments();
        const orderCount = await Order.countDocuments();

        // Get recent orders
        const recentOrders = await Order.find()
            .sort({ orderdate: -1 })
            .limit(5)
            .populate('userid', 'username email')
            .select('orderdate totalprice status paymentstatus');

        // Calculate total revenue
        const orders = await Order.find({ status: { $ne: 'cancelled' } });
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalprice, 0);

        // Get product distribution by category
        const products = await Product.find();
        const categories = {};

        products.forEach(product => {
            if (product.category) {
                if (categories[product.category]) {
                    categories[product.category]++;
                } else {
                    categories[product.category] = 1;
                }
            }
        });

        // Get order status distribution
        const orderStatuses = await Order.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const statusDistribution = {};
        orderStatuses.forEach(status => {
            statusDistribution[status._id] = status.count;
        });

        res.status(200).json({
            userCount,
            productCount,
            orderCount,
            totalRevenue,
            recentOrders,
            categoryDistribution: categories,
            orderStatusDistribution: statusDistribution
        });
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        res.status(500).json({ message: 'Error getting dashboard statistics', error: error.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: 'Error getting users', error: error.message });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ message: 'Error getting user', error: error.message });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const { username, email, fullName, phoneNumber, address, role } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        if (username) user.username = username;
        if (email) user.email = email;
        if (fullName) user.fullName = fullName;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (address) user.address = address;
        if (role) user.role = role;

        await user.save();

        res.status(200).json({
            message: 'User updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).json({ message: 'Error getting products', error: error.message });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error getting product:', error);
        res.status(500).json({ message: 'Error getting product', error: error.message });
    }
};

// Create product
exports.createProduct = async (req, res) => {
    try {
        const { productname, price, description, category, imageUrl, images, stockQuantity, rating } = req.body;

        const product = new Product({
            productname,
            price,
            description,
            category,
            imageUrl,
            images: images || [],
            stockQuantity,
            rating
        });

        await product.save();

        res.status(201).json({
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const { productname, price, description, category, imageUrl, images, stockQuantity, rating } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update fields
        if (productname) product.productname = productname;
        if (price) product.price = price;
        if (description) product.description = description;
        if (category) product.category = category;
        if (imageUrl) product.imageUrl = imageUrl;
        if (images !== undefined) product.images = images;
        if (stockQuantity !== undefined) product.stockQuantity = stockQuantity;
        if (rating !== undefined) product.rating = rating;

        await product.save();

        res.status(200).json({
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userid', 'username email')
            .sort({ orderdate: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).json({ message: 'Error getting orders', error: error.message });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userid', 'username email fullName phoneNumber')
            .populate('productids.productid', 'productname price imageUrl');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error getting order:', error);
        res.status(500).json({ message: 'Error getting order', error: error.message });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, paymentstatus } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update status
        if (status) {
            order.status = status;

            // Update date fields based on status
            if (status === 'delivered') {
                order.delivereddate = new Date();
            } else if (status === 'cancelled') {
                order.cancelleddate = new Date();
            }
        }

        // Update payment status
        if (paymentstatus) {
            order.paymentstatus = paymentstatus;
        }

        await order.save();

        res.status(200).json({
            message: 'Order updated successfully',
            order
        });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
};
