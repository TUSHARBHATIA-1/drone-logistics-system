const path = require('path');
const { optimizeRoute } = require('../utils/routeOptimizer');
const Assignment = require('../models/Assignment');
const Drone = require('../models/Drone');

// @desc    Create new delivery assignment & auto-assign drone via C++ engine
// @route   POST /api/assignments
// @access  Private
const createAssignment = async (req, res, next) => {
    try {
        const { pickupLocation, deliveryLocations, packageWeight, priority, deadline, startNodeId, targetNodeId } = req.body;

        // 1. Find suitable drones
        const availableDrones = await Drone.find({
            companyId: req.user.id,
            status: 'available',
            maxWeight: { $gte: packageWeight },
            currentBattery: { $gt: 50 }
        }).sort({ currentBattery: -1 });

        if (availableDrones.length === 0) {
            res.status(400);
            throw new Error('No suitable drones available for this assignment');
        }

        const selectedDrone = availableDrones[0];

        // 2. JS Route Optimizer (Replaces C++ Engine for Cloud Compatibility)
        const result = optimizeRoute(startNodeId || 0, targetNodeId || 5);

        if (!result.success) {
            console.error(`Optimization Error: ${result.message}`);
            return res.status(500).json({ success: false, message: "Route optimization engine failed" });
        }

        const optimizedRoute = result.route;
        const totalDistance = result.distance;

        // 3. Create Assignment with dynamic route
        const deliveryId = `DEL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        const assignment = await Assignment.create({
            deliveryId,
            pickupLocation,
            deliveryLocations,
            packageWeight,
            priority,
            deadline,
            assignedDrone: selectedDrone._id,
            status: 'assigned',
            route: optimizedRoute
        });

        // 4. Mark drone as busy & set route for simulation
        // Node mapping for frontend
        const nodeToCoords = {
            0: [28.6139, 77.2090], // HQ Warehouse
            1: [28.6200, 77.2100], // Urban Hub A
            2: [28.6100, 77.2300], // Storage Zone B
            3: [28.6300, 77.2000], // Delivery Dock C
            4: [28.6400, 77.2200], // Landing Pad D
            5: [28.6500, 77.2100]  // Emergency Hub E
        };

        const routeCoords = optimizedRoute.map(name => {
            const entries = Object.entries({
                "Main Warehouse": 0, "Downtown Hub": 1, "Suburban Station": 2, 
                "Industrial Area": 3, "Residential Park": 4, "Coastal Port": 5
            });
            const id = entries.find(([n, i]) => n === name)?.[1] || 0;
            return nodeToCoords[id];
        });

        selectedDrone.status = 'busy';
        selectedDrone.currentRoute = routeCoords;
        selectedDrone.assignedDelivery = deliveryId;
        await selectedDrone.save();

        res.status(201).json({
            success: true,
            data: assignment,
            distance: totalDistance,
            estimatedTime: `${totalDistance * 2} minutes`,
            mapData: {
                warehouse: nodeToCoords[0],
                pickup: nodeToCoords[startNodeId || 0],
                deliveries: [nodeToCoords[targetNodeId || 5]],
                route: routeCoords
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all company assignments
// @route   GET /api/assignments
// @access  Private
const getAssignments = async (req, res, next) => {
    try {
        const assignments = await Assignment.find()
            .populate('assignedDrone', 'droneId modelNumber status');

        // Filter assignments based on drone ownership (since assignments don't have companyId directly)
        const filteredAssignments = assignments.filter(a => 
            a.assignedDrone && a.assignedDrone.status !== 'retired' // Basic filter
        );

        res.status(200).json({
            success: true,
            count: filteredAssignments.length,
            data: filteredAssignments
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single assignment details & tracking
// @route   GET /api/assignments/:id
// @access  Private
const trackAssignment = async (req, res, next) => {
    try {
        const assignment = await Assignment.findById(req.params.id).populate('assignedDrone');

        if (!assignment) {
            res.status(404);
            throw new Error('Assignment not found');
        }

        res.status(200).json({
            success: true,
            data: assignment,
            currentLocation: "En route to Node-B",
            progress: "25%"
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel assignment
// @route   DELETE /api/assignments/:id
// @access  Private
const cancelAssignment = async (req, res, next) => {
    try {
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            res.status(404);
            throw new Error('Assignment not found');
        }

        if (assignment.status === 'delivered') {
            res.status(400);
            throw new Error('Cannot cancel a delivered assignment');
        }

        // Free the drone
        if (assignment.assignedDrone) {
            const drone = await Drone.findById(assignment.assignedDrone);
            if (drone) {
                drone.status = 'available';
                await drone.save();
            }
        }

        assignment.status = 'cancelled';
        await assignment.save();

        res.status(200).json({
            success: true,
            message: 'Assignment cancelled and drone released'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createAssignment,
    getAssignments,
    trackAssignment,
    cancelAssignment
};
