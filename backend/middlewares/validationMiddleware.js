const { body, validationResult } = require('express-validator');

// Middleware to handle validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false, 
            errors: errors.array().map(err => ({ field: err.path, message: err.msg })) 
        });
    }
    next();
};

// Registration Validation
const registerValidation = [
    body('username').trim().notEmpty().withMessage('Username is required').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('companyName').trim().notEmpty().withMessage('Company name is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required').isMobilePhone().withMessage('Invalid phone number format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/).withMessage('Password must include uppercase, lowercase, and a number'),
    validate
];

// Login Validation
const loginValidation = [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
];

// Drone Validation
const droneValidation = [
    body('droneId').trim().notEmpty().withMessage('Drone ID is required'),
    body('modelNumber').trim().notEmpty().withMessage('Model number is required'),
    body('maxWeight').isFloat({ min: 0.1 }).withMessage('Valid max weight is required'),
    body('batteryCapacity').isInt({ min: 100 }).withMessage('Valid battery capacity is required'),
    validate
];

// Assignment Validation
const assignmentValidation = [
    body('pickupLocation').trim().notEmpty().withMessage('Pickup location name is required'),
    body('deliveryLocations').isArray({ min: 1 }).withMessage('At least one delivery location is required'),
    body('packageWeight').isFloat({ min: 0.1 }).withMessage('Valid package weight is required'),
    body('startNodeId').isInt({ min: 0, max: 5 }).withMessage('Invalid origin node'),
    body('targetNodeId').isInt({ min: 0, max: 5 }).withMessage('Invalid target node'),
    validate
];

module.exports = {
    registerValidation,
    loginValidation,
    droneValidation,
    assignmentValidation
};
