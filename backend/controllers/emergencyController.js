const { exec } = require('child_process');
const path = require('path');
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

        // 1. Execute C++ engine in SAFETY mode
        const enginePath = path.join(__dirname, '../../algorithms/route_optimizer');
        const command = `"${enginePath}" SAFETY ${currentLocationID}`;

        exec(command, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Engine Error: ${stderr}`);
                return res.status(500).json({ success: false, message: 'Safety engine failed' });
            }

            // Parse engine output
            const lines = stdout.split('\n');
            let nearestHub = '';
            let distance = '';
            let route = '';

            lines.forEach(line => {
                if (line.startsWith('NEAREST_HUB:')) nearestHub = line.split(':')[1].trim();
                if (line.startsWith('DISTANCE:')) distance = line.split(':')[1].trim();
                if (line.startsWith('ROUTE:')) route = line.split(':')[1].trim();
            });

            // 2. update drone status
            drone.status = 'maintenance';
            await drone.save();

            // 3. Create Critical Notification
            await Notification.create({
                user: req.user.id,
                type: 'Battery', // Using Battery as a proxy for high priority/emergency
                title: `EMERGENCY: ${triggerType}`,
                message: `Drone ${drone.modelNumber} has triggered an emergency. Nearest safe zone: ${nearestHub}. Estimated route: ${route}`,
                drone: drone._id
            });

            res.status(200).json({
                success: true,
                message: 'Emergency protocol initiated',
                nearestHub,
                distance,
                route
            });
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    triggerEmergency
};
