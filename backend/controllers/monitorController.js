const Drone = require('../models/Drone');

// @desc    Get all active drones for monitoring
// @route   GET /api/monitor/drones
// @access  Private
const getMonitoringData = async (req, res, next) => {
    try {
        const drones = await Drone.find({ companyId: req.user.id });
        res.status(200).json({
            success: true,
            count: drones.length,
            data: drones
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update drone location
// @route   PUT /api/monitor/update-location/:droneId
// @access  Private (Internal/System)
const updateLocation = async (req, res, next) => {
    try {
        const { location } = req.body;
        const drone = await Drone.findOneAndUpdate(
            { droneId: req.params.droneId },
            { currentLocation: location },
            { new: true, runValidators: true }
        );

        if (!drone) {
            return res.status(404).json({ message: 'Drone not found' });
        }

        res.status(200).json({ success: true, data: drone });
    } catch (error) {
        next(error);
    }
};

// @desc    Update drone battery
// @route   PUT /api/monitor/update-battery/:droneId
// @access  Private (Internal/System)
const updateBattery = async (req, res, next) => {
    try {
        const { batteryLevel } = req.body;
        const drone = await Drone.findOneAndUpdate(
            { droneId: req.params.droneId },
            { currentBattery: batteryLevel },
            { new: true, runValidators: true }
        );

        if (!drone) {
            return res.status(404).json({ message: 'Drone not found' });
        }

        res.status(200).json({ success: true, data: drone });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMonitoringData,
    updateLocation,
    updateBattery
};
