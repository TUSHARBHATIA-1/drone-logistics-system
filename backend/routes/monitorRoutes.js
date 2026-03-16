const express = require('express');
const router = express.Router();
const { getMonitoringData, updateLocation, updateBattery } = require('../controllers/monitorController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);
router.get('/drones', getMonitoringData);
router.put('/update-location/:droneId', updateLocation);
router.put('/update-battery/:droneId', updateBattery);

module.exports = router;
