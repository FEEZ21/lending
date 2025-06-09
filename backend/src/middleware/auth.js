const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            console.log('Auth middleware: No token provided.');
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findOne({ _id: decoded.userId });

        if (!user) {
            console.log('Auth middleware: User not found for decoded ID.');
            throw new Error();
        }

        req.token = token;
        req.user = user;
        console.log(`Auth middleware: User authenticated. User ID: ${user._id}, Role: ${user.role}`);
        next();
    } catch (err) {
        console.error('Auth middleware error:', err.message);
        res.status(401).json({ message: 'Please authenticate' });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        await auth(req, res, () => {
            console.log(`AdminAuth middleware: Checking user role. User ID: ${req.user?._id}, Role: ${req.user?.role}`);
            if (req.user.role !== 'admin') {
                console.log(`AdminAuth middleware: Access denied. Role is not 'admin'.`);
                return res.status(403).json({ message: 'Access denied' });
            }
            console.log(`AdminAuth middleware: Access granted. Role is 'admin'.`);
            next();
        });
    } catch (err) {
        console.error('AdminAuth middleware error:', err.message);
        res.status(401).json({ message: 'Please authenticate' });
    }
};

module.exports = { auth, adminAuth }; 