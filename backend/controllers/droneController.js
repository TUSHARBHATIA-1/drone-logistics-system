const Drone = require('../models/Drone');

// @desc    Add a new drone
// @route   POST /api/drones
// @access  Private
const addDrone = async (req, res, next) => {
  try {
    req.body.companyId = req.user.id;

    // Auto-generate droneId if not provided
    if (!req.body.droneId) {
      const count = await Drone.countDocuments({ companyId: req.user.id });
      req.body.droneId = `HULL-${String(count + 1).padStart(3, '0')}`;
    }

    const drone = await Drone.create(req.body);
    res.status(201).json({ success: true, data: drone });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: `Drone ID "${req.body.droneId}" already exists. Choose a different ID.` });
    }
    next(error);
  }
};

// @desc    Get drones — owner sees theirs, public GET sees all (for demo)
// @route   GET /api/drones
// @access  Public (filtered if token provided)
const getDrones = async (req, res, next) => {
  try {
    // If a valid JWT was attached and verified, scope to owner
    const filter = req.user ? { companyId: req.user.id } : {};

    const drones = await Drone.find(filter)
      .populate('companyId', 'name email username')
      .sort({ createdAt: -1 });

    // Compute aggregate stats for dashboard
    const total    = drones.length;
    const active   = drones.filter(d => d.status === 'available').length;
    const busy     = drones.filter(d => d.status === 'busy').length;
    const maintenance = drones.filter(d => d.status === 'maintenance').length;
    const avgBattery = total
      ? Math.round(drones.reduce((s, d) => s + (d.currentBattery || 0), 0) / total)
      : 0;
    const totalPayload = drones.reduce((s, d) => s + (d.maxWeight || 0), 0);

    res.status(200).json({
      success: true,
      count: total,
      stats: { total, active, busy, maintenance, avgBattery, totalPayload },
      data: drones
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single drone by ID
// @route   GET /api/drones/:id
// @access  Private
const getDrone = async (req, res, next) => {
  try {
    const drone = await Drone.findById(req.params.id).populate('companyId', 'name email');
    if (!drone) return res.status(404).json({ success: false, message: 'Drone not found' });
    res.status(200).json({ success: true, data: drone });
  } catch (error) {
    next(error);
  }
};

// @desc    Update drone (status, battery, location, etc.)
// @route   PUT /api/drones/:id
// @access  Private (owner only)
const updateDrone = async (req, res, next) => {
  try {
    let drone = await Drone.findById(req.params.id);
    if (!drone) return res.status(404).json({ success: false, message: 'Drone not found' });

    if (drone.companyId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this drone' });
    }

    // Prevent companyId from being changed via update
    delete req.body.companyId;

    drone = await Drone.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: drone });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark drone as under maintenance
// @route   PUT /api/drones/:id/repair
// @access  Private (owner only)
const markRepair = async (req, res, next) => {
  try {
    let drone = await Drone.findById(req.params.id);
    if (!drone) return res.status(404).json({ success: false, message: 'Drone not found' });

    if (drone.companyId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    drone.status = 'maintenance';
    await drone.save();

    res.status(200).json({ success: true, data: drone });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete / decommission drone
// @route   DELETE /api/drones/:id
// @access  Private (owner only)
const deleteDrone = async (req, res, next) => {
  try {
    const drone = await Drone.findById(req.params.id);
    if (!drone) return res.status(404).json({ success: false, message: 'Drone not found' });

    if (drone.companyId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this drone' });
    }

    await drone.deleteOne();
    res.status(200).json({ success: true, message: 'Drone decommissioned', data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = { addDrone, getDrones, getDrone, updateDrone, markRepair, deleteDrone };