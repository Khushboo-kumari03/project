const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productids: [{
        productid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    shippingaddress: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        lowercase: true
    },
    totalprice: {
        type: Number,
        required: true,
        min: 0
    },
    paymentstatus: {
        type: String,
        default: 'pending',
        enum: ['pending', 'paid'],
        lowercase: true
    },
    paymentmethod: {
        type: String,
        default: 'cod',
        enum: ['cod', 'online'],
        lowercase: true
    },
    orderdate: {
        type: Date,
        default: Date.now
    },
    deliverydate: {
        type: Date,
        default: function() {
            const date = new Date();
            date.setDate(date.getDate() + 7);
            return date;
        }
    },
    cancelleddate: {
        type: Date
    },
    delivereddate: {
        type: Date
    }
}, { 
    timestamps: true 
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
   