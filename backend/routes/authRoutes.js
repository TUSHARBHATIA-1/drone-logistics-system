const express = require('express');
const router = express.Router();
const { registerUser, authUser } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middlewares/validationMiddleware');

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, authUser);

module.exports = router;