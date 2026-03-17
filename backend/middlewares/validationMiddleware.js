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

const registerValidation = [
    body('companyName').trim().notEmpty().withMessage('Company name is required'),
    body('contactPerson').trim().notEmpty().withMessage('Contact person is required'),
    body('email').trim().isEmail().withMessage('Please provide a valid corporate email'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('warehouseAddress').trim().notEmpty().withMessage('Warehouse address is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate
];

// Login Validation
const loginValidation = [
    body('email').trim().isEmail().withMessage('Valid email is required'),
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
