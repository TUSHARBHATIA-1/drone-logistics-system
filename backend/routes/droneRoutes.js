const express = require('express');
const router = express.Router();
const { addDrone, getDrones, updateDrone, markRepair, deleteDrone } = require('../controllers/droneController');
const { protect } = require('../middlewares/authMiddleware');
const { droneValidation } = require('../middlewares/validationMiddleware');

router.use(protect);
router.route('/').get(getDrones).post(droneValidation, addDrone);
router.route('/:id').put(updateDrone).delete(deleteDrone);
router.put('/:id/repair', markRepair);

module.exports = router;
