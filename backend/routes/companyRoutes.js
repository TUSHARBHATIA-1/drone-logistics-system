const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { setupCompany, getCompanyProfile } = require('../controllers/companyController');

// POST /api/company/setup  — create or update company drone configuration
router.post('/setup', protect, setupCompany);

// GET /api/company/profile — fetch current user's company profile
router.get('/profile', protect, getCompanyProfile);

module.exports = router;
