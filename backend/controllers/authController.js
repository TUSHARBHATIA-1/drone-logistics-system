const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  console.log("Backend Register Data received:", req.body);
  try {
    const {
      username,
      companyName,
      contactPerson,
      email,
      phone,
      warehouseAddress,
      password
    } = req.body;

    // check existing user
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    if (userExists) {
      res.status(400);
      throw new Error('User with this email or username already exists');
    }

    // create user
    const user = await User.create({
      username,
      name: companyName,
      contactPerson,
      email,
      phone,
      warehouseAddress,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
    registerUser,
    authUser,
};
