const path = require('path');
const { getSafetyRoute } = require('../utils/routeOptimizer');
const Drone = require('../models/Drone');
const Notification = require('../models/Notification');

// @desc    Trigger emergency landing
// @route   POST /api/emergency/trigger
// @access  Private
const triggerEmergency = async (req, res, next) => {
    try {
        const { droneId, triggerType, currentLocationID } = req.body;

        const drone = await Drone.findById(droneId);
        if (!drone) {
            res.status(404);
            throw new Error('Drone not found');
        }

        // 1. JS Route Optimizer (Replaces C++ Engine)
        const result = getSafetyRoute(currentLocationID);

        if (!result.success) {
            console.error(`Safety Engine Error: ${result.message}`);
            return res.status(500).json({ success: false, message: 'Safety engine failed' });
        }

        const { nearestHub, distance, route } = result;

        // 2. update drone status
        drone.status = 'maintenance';
        await drone.save();

        // 3. Create Critical Notification
        await Notification.create({
            user: req.user.id,
            type: 'Battery', // Using Battery as a proxy for high priority/emergency
            title: `EMERGENCY: ${triggerType}`,
            message: `Drone ${drone.modelNumber} has triggered an emergency. Nearest safe zone: ${nearestHub}. Estimated route: ${route.join(', ')}`,
            drone: drone._id
        });

        res.status(200).json({
            success: true,
            message: 'Emergency protocol initiated',
            nearestHub,
            distance,
            route: route.join(', ')
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    triggerEmergency
};
