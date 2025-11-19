const cartmodel = require("../models/cartmodel");
const productsModel = require("../models/productsmodel");
const userModel = require("../models/usermodel");
const mongoose = require('mongoose');

async function addtocart(req,res){
    try {
        let userid = req.params.userid;
        let productid = req.params.productid;
        let quantity = req.body.quantity || 1;

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(userid) || !mongoose.Types.ObjectId.isValid(productid)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid user ID or product ID format' 
            });
        }

        // Check if the product exists
        const product = await productsModel.findById(productid);
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found' 
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

        // Check if product is already in cart
        const existingCart = await cartmodel.findOne({ userid, productid });
        if (existingCart) {
            existingCart.quantity += quantity;
            await existingCart.save();
            return res.status(200).json({ 
                success: true,
                message: 'Cart quantity updated successfully', 
                cart: existingCart 
            });
        }

        // Create new cart item
        const newcart = new cartmodel({
            userid: userid,
            productid: productid,
            quantity: quantity
        });
        await newcart.save();

        return res.status(201).json({ 
            success: true,
            message: 'Product added to cart successfully', 
            cart: newcart 
        });
    } catch (error) {
        console.error('Error in addtocart:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error',
            error: error.message 
        });
    }
}

async function allcarts(req,res){
    try {
        const carts = await cartmodel.find()
            .populate('productid', 'productname description price imageUrl stockQuantity')
            .populate('userid', 'username email');

        return res.status(200).json({ 
            success: true,
            message: 'Carts fetched successfully', 
            carts 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error',
            error: error.message 
        });
    }
}

async function getcartsByuserid(req,res){
    try {
        let userid = req.params.userid;
        
        // Validate if userid is in correct MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(userid)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid user ID format'
            });
        }

        const user = await userModel.findById(userid);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found'
            });
        }

        // Fetch cart items with populated product details
        const carts = await cartmodel.find({userid: userid})
            .populate({
                path: 'productid',
                select: 'productname description price imageUrl stockQuantity'
            });
        
        // Transform the data to include calculated totals
        const transformedCarts = carts.map(cart => {
            const product = cart.productid;
            if (!product) return null;
            
            return {
                _id: cart._id,
                quantity: cart.quantity,
                productid: {
                    _id: product._id,
                    productname: product.productname,
                    description: product.description,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    stockQuantity: product.stockQuantity
                },
                total: product.price * cart.quantity
            };
        }).filter(cart => cart !== null);
        
        // Calculate cart totals
        const subtotal = transformedCarts.reduce((sum, cart) => sum + cart.total, 0);
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + tax;
        
        return res.status(200).json({ 
            success: true,
            message: transformedCarts.length ? 'Carts fetched successfully' : 'No items in cart',
            carts: transformedCarts,
            summary: {
                subtotal,
                tax,
                total
            }
        });
    } catch (error) {
        console.error('Error in getcartsByuserid:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error', 
            error: error.message 
        });
    }
}

async function updatecart(req,res){
    try {
        const id = req.params.id;
        const quantity = req.body.quantity;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid cart ID format' 
            });
        }

        if (!quantity || quantity < 1) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid quantity' 
            });
        }

        const cart = await cartmodel.findByIdAndUpdate(
            id,
            { quantity: quantity },
            { new: true }
        ).populate('productid', 'productname price imageUrl stockQuantity');

        if (!cart) {
            return res.status(404).json({ 
                success: false,
                message: 'Cart not found' 
            });
        }

        return res.status(200).json({ 
            success: true,
            message: 'Cart updated successfully', 
            cart 
        });
    } catch (error) {
        console.error('Error in updatecart:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error',
            error: error.message 
        });
    }
}

async function deletecart(req,res){
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid cart ID format' 
            });
        }

        const cart = await cartmodel.findByIdAndDelete(id);
        if (!cart) {
            return res.status(404).json({ 
                success: false,
                message: 'Cart not found' 
            });
        }

        return res.status(200).json({ 
            success: true,
            message: 'Cart deleted successfully'
        });
    } catch (error) {
        console.error('Error in deletecart:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error',
            error: error.message 
        });
    }
}

module.exports = {
    addtocart,
    allcarts,
    getcartsByuserid,
    updatecart,
    deletecart
};
    