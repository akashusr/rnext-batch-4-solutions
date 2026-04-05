const jwt = require('jsonwebtoken');
const { User, Company } = require('../models');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user or company from the token
            if (decoded.role === 'USER') {
                req.user = await User.findByPk(decoded.id);
                if (!req.user) {
                    return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
                }
            } else if (decoded.role === 'COMPANY') {
                req.company = await Company.findByPk(decoded.id);
                if (!req.company) {
                    return res.status(401).json({ success: false, message: 'Not authorized, company not found' });
                }
            } else {
                return res.status(401).json({ success: false, message: 'Not authorized, invalid role' });
            }

            req.userRole = decoded.role;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

// Middleware to check for specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userRole)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.userRole} is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
