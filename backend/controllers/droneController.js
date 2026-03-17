const Drone = require('../models/Drone');

// @desc    Add a new drone
// @route   POST /api/drones
// @access  Private
const addDrone = async (req, res, next) => {
    try {
        req.body.companyId = req.user.id;

        const drone = await Drone.create(req.body);

        res.status(201).json({
            success: true,
            data: drone
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all drones (PUBLIC for demo)
// @route   GET /api/drones
// @access  Public
const getDrones = async (req, res, next) => {
    try {
        const drones = await Drone.find(); // ✅ FIXED

        res.status(200).json({
            success: true,
            count: drones.length,
            data: drones
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update drone
const updateDrone = async (req, res, next) => {
    try {
        let drone = await Drone.findById(req.params.id);

        if (!drone) {
            return res.status(404).json({ message: 'Drone not found' });
        }

        if (drone.companyId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        drone = await Drone.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: drone
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark drone repair
const markRepair = async (req, res, next) => {
    try {
        let drone = await Drone.findById(req.params.id);

        if (!drone) {
            return res.status(404).json({ message: 'Drone not found' });
        }

        if (drone.companyId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        drone.status = 'maintenance';
        await drone.save();

        res.status(200).json({
            success: true,
            data: drone
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete drone
const deleteDrone = async (req, res, next) => {
    try {
        const drone = await Drone.findById(req.params.id);

        if (!drone) {
            return res.status(404).json({ message: 'Drone not found' });
        }

        if (drone.companyId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await drone.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addDrone,
    getDrones,
    updateDrone,
    markRepair,
    deleteDrone
};