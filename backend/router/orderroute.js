const express = require('express');
const router = express.Router();
const { placeorder, getorders, userorderhistory, deleteorder, updateorder } = require('../controllers/ordercontroller');
const auth = require('../middleware/auth');

// Protected order routes - require authentication
router.post('/:userid', auth, placeorder);
router.get('/all', auth, getorders);
router.get('/history/:userid', auth, userorderhistory);
router.delete('/:id', auth, deleteorder);
router.put('/:id', auth, updateorder);

module.exports = router;
