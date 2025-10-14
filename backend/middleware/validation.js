import { body, validationResult } from 'express-validator';

// User registration validation
export const validateSignup = [
    body('username')
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('fullname')
        .isLength({ min: 2, max: 50 })
        .withMessage('Full name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Full name can only contain letters and spaces'),
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
    body('phoneno')
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    
    body('city')
        .optional()
        .isLength({ min: 2, max: 30 })
        .withMessage('City must be between 2 and 30 characters'),
    
    body('pincode')
        .optional()
        .isPostalCode('any')
        .withMessage('Please provide a valid pincode'),
];

// User login validation
export const validateLogin = [
    body('username')
        .notEmpty()
        .withMessage('Username is required'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

// Item validation for admin
export const validateItem = [
    body('itemname')
        .isLength({ min: 2, max: 100 })
        .withMessage('Item name must be between 2 and 100 characters'),
    
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    
    body('rating')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    
    body('hotelName')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Hotel name must be between 2 and 50 characters'),
    
    body('hotelCity')
        .optional()
        .isLength({ min: 2, max: 30 })
        .withMessage('Hotel city must be between 2 and 30 characters'),
];

// Middleware to check validation results
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next();
};

// Rate limiting for auth endpoints
export const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 5) => {
    const requests = new Map();
    
    return (req, res, next) => {
        const clientIp = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        
        if (!requests.has(clientIp)) {
            requests.set(clientIp, { count: 1, resetTime: now + windowMs });
            return next();
        }
        
        const clientData = requests.get(clientIp);
        
        if (now > clientData.resetTime) {
            requests.set(clientIp, { count: 1, resetTime: now + windowMs });
            return next();
        }
        
        if (clientData.count >= max) {
            return res.status(429).json({
                error: 'Too many requests. Please try again later.',
                retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
            });
        }
        
        clientData.count += 1;
        next();
    };
};

// Security headers middleware
export const securityHeaders = (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
    
    next();
};