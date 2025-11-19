const express = require('express');
const router = express.Router();
const { signup, login, checkEmail } = require('../controllers/authcontroller');
const auth = require('../middleware/auth');

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Check email availability
router.post('/check-email', checkEmail);

// Get current user
router.get('/me', auth, (req, res) => {
    res.json(req.user);
});

module.exports = router;

