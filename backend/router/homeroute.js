const express = require('express');
const router = express.Router();
const { getHomeData } = require('../controllers/homecontroller');

// Get home page data
router.get('/', getHomeData);

module.exports = router; 