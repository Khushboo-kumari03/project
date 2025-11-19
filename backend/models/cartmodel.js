const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userid:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productid:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Products',
    required: true
  },
    quantity:{
        type: Number,
        default: 1
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
},{timestamps:true});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;

