const express = require('express');
const router  = express.Router();

const { addDrone, getDrones, getDrone, updateDrone, markRepair, deleteDrone } = require('../controllers/droneController');
const { protect } = require('../middlewares/authMiddleware');
const { droneValidation } = require('../middlewares/validationMiddleware');

// GET is public for demo/marketplace, but the controller scopes to owner if token present
router.get('/',    protect, getDrones);       // changed to protected so stats are scoped
router.get('/:id', protect, getDrone);

router.post('/',         protect, droneValidation, addDrone);
router.put('/:id',       protect, updateDrone);
router.put('/:id/repair',protect, markRepair);
router.delete('/:id',    protect, deleteDrone);

module.exports = router;