const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET ;

if (!JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET is not defined in auth middleware!');
} else {
    console.log('JWT_SECRET initialized in auth middleware.');
}

const protect = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')          
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Add user info to request
            req.user = decoded;
            next();
        } catch (error) {
            console.error('JWT Verification Error:', error);
            res.status(401).json({
                success: false,
                message: 'Not authorized, token failed'
            });
        }
    }   

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token'
        });
    }
};

module.exports = { protect };
