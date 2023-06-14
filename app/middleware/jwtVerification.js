const jwt = require('jsonwebtoken');
const secretKey = 'workluge-secret-key';

// Function to decode JWT token
const decodeToken = (token) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return { error: 'Invalid token' };
    }
};

// Middleware to decode JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        req.decodedToken = decodeToken(token);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};




// Middleware to check user role
const checkUserRole = (role) => (req, res, next) => {
    const { role: userRole } = req.decodedToken;

    if (userRole !== role) {
        return res.status(403).json({ message: 'Access denied' });
    }

    next();
};

module.exports = {
    authenticateToken,
    checkUserRole,
};
