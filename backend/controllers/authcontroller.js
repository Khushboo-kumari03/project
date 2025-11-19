const UserModel = require('../models/usermodel');
const jwt = require('jsonwebtoken');

// Signup controller
async function signup(req, res) {
    try {
        const { username, email, password, fullName, phoneNumber, address } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email or username'
            });
        }

        // Create new user
        const user = new UserModel({
            username,
            email,
            password,
            fullName,
            phoneNumber,
            address
        });

        // Save user
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Return success response
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({
            message: 'Error registering user',
            error: error.message
        });
    }
}

// Login controller
async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Return success response
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({
            message: 'Error logging in',
            error: error.message
        });
    }
}

// Check email availability
async function checkEmail(req, res) {
    try {
        const { email } = req.body;

        // Check if user exists with this email
        const existingUser = await UserModel.findOne({ email });

        res.status(200).json({
            exists: !!existingUser
        });

    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({
            message: 'Error checking email',
            error: error.message
        });
    }
}

module.exports = {
    signup,
    login,
    checkEmail
};