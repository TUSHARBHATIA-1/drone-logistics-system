const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/authMiddleware');
const {
  setupCompany,
  getCompanyProfile,
} = require('../controllers/companyController');

router.post('/setup', protect, setupCompany);
router.get('/profile', protect, getCompanyProfile);

module.exports = router;