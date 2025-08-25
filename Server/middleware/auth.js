const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

async function authMiddleware(req, res, next) {
    let token;

    // 1️⃣ Try cookie first
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    // 2️⃣ Fallback to Authorization header
    else if (req.headers.authorization) {
        const [scheme, headerToken] = req.headers.authorization.split(' ');
        if (scheme === 'Bearer' && headerToken) token = headerToken;
    }

    if (!token) return res.status(401).json({ message: 'Missing token' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(401).json({ message: 'User not found' });

        req.user = user; // attach user to request
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = { authMiddleware, JWT_SECRET };
