const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin role required' });
        }
        
        req.user = user;
        next();
    } catch (err) {
        console.error('Admin middleware error:', err);
        res.status(401).json({ message: 'Invalid token' });
    }
};
