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

// @desc    Get all drones for a company
// @route   GET /api/drones
// @access  Private
const getDrones = async (req, res, next) => {
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

// @desc    Update drone details/status
// @route   PUT /api/drones/:id
// @access  Private
const updateDrone = async (req, res, next) => {
    try {
        let drone = await Drone.findById(req.params.id);

        if (!drone) {
            res.status(404);
            throw new Error(`Drone not found with id of ${req.params.id}`);
        }

        // Make sure user is drone owner
        if (drone.companyId.toString() !== req.user.id) {
            res.status(401);
            throw new Error(`User ${req.user.id} is not authorized to update this drone`);
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

// @desc    Mark drone under repair
// @route   PUT /api/drones/:id/repair
// @access  Private
const markRepair = async (req, res, next) => {
    try {
        let drone = await Drone.findById(req.params.id);

        if (!drone) {
            res.status(404);
            throw new Error('Drone not found');
        }

        if (drone.companyId.toString() !== req.user.id) {
            res.status(401);
            throw new Error('Not authorized');
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
// @route   DELETE /api/drones/:id
// @access  Private
const deleteDrone = async (req, res, next) => {
    try {
        const drone = await Drone.findById(req.params.id);

        if (!drone) {
            res.status(404);
            throw new Error('Drone not found');
        }

        if (drone.companyId.toString() !== req.user.id) {
            res.status(401);
            throw new Error('Not authorized');
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
