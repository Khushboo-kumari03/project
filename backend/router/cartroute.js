const express = require('express');
const router = express.Router();
const { addtocart, allcarts, getcartsByuserid, updatecart, deletecart } = require('../controllers/cartcontroller');
const auth = require('../middleware/auth');

// Protected cart routes - require authentication
router.post('/:userid/:productid', auth, addtocart);
router.get('/', auth, allcarts);
router.get('/:userid', auth, getcartsByuserid);
router.put('/:id', auth, updatecart);
router.delete('/:id', auth, deletecart);

module.exports = router;

