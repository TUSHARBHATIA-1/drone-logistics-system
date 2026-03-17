const express = require('express');
const router = express.Router();

const {
  addDrone,
  getDrones,
  updateDrone,
  markRepair,
  deleteDrone
} = require('../controllers/droneController');

const { protect } = require('../middlewares/authMiddleware');
const { droneValidation } = require('../middlewares/validationMiddleware');

// ✅ PUBLIC (for demo + UI)
router.get('/', getDrones);

// 🔒 PROTECTED
router.post('/', protect, droneValidation, addDrone);
router.put('/:id', protect, updateDrone);
router.delete('/:id', protect, deleteDrone);
router.put('/:id/repair', protect, markRepair);

module.exports = router;