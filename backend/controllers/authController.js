const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const { companyName, username, phone, address, warehouseAddress, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            res.status(400);
            throw new Error('Passwords do not match');
        }

        const userExists = await User.findOne({ username });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            companyName,
            username,
            phone,
            address,
            warehouseAddress,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                companyName: user.companyName,
                username: user.username,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                companyName: user.companyName,
                username: user.username,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error('Invalid username or password');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    authUser,
};
