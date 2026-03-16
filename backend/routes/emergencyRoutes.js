const express = require('express');
const router = express.Router();
const { triggerEmergency } = require('../controllers/emergencyController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/trigger', protect, triggerEmergency);

module.exports = router;
