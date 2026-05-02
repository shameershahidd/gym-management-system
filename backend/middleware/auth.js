const jwt = require('jsonwebtoken');

// Replace this with a secure secret in .env later
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Middleware to protect routes by ensuring a valid JWT token exists.
 */
function protect(req, res, next) {
    let token = req.headers.authorization;
    if (token && token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized to access this route. Login required.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // add user id & role to the request!
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
}

/**
 
 * @param req.user from JWT
 * @param expectedRoles array of allowed roles
 */
function restrictTo(...allowedRoles) {
    return (req, res, next) => {
        // e.g. if req.user.role is 'viewer' but allowed is ['admin', 'staff'] => 403 Forbidden
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Your user role does not have permission to perform this action.' });
        }
        next();
    };
}

module.exports = {
    protect,
    restrictTo,
    JWT_SECRET
};