const express = require('express');
const router = express.Router();
const { getAboutData } = require('../controllers/aboutcontroller');

// GET /api/about
router.get('/', getAboutData);

module.exports = router; 