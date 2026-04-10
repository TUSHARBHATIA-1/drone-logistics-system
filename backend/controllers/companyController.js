const CompanyProfile = require('../models/CompanyProfile');

// ─────────────────────────────────────────────────────────
// @route   POST /api/company/setup
// @access  Private
// @desc    Create or update company drone configuration
// ─────────────────────────────────────────────────────────
const setupCompany = async (req, res) => {
  try {
    const {
      totalDrones,
      activeDrones,
      inactiveDrones,
      maxRange,
      minRange,
      location,
      droneTypes,
      maintenanceNotes,
    } = req.body;

    // ── Manual validation (before hitting the model) ──────
    const missing = [];
    if (totalDrones === undefined || totalDrones === '')  missing.push('totalDrones');
    if (activeDrones === undefined || activeDrones === '') missing.push('activeDrones');
    if (inactiveDrones === undefined || inactiveDrones === '') missing.push('inactiveDrones');
    if (maxRange === undefined || maxRange === '')         missing.push('maxRange');
    if (minRange === undefined || minRange === '')         missing.push('minRange');
    if (!location?.address)                               missing.push('location.address');

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`,
      });
    }

    // ── Numeric coercion & business rules ─────────────────
    const total    = Number(totalDrones);
    const active   = Number(activeDrones);
    const inactive = Number(inactiveDrones);
    const maxR     = Number(maxRange);
    const minR     = Number(minRange);

    if (active + inactive !== total) {
      return res.status(400).json({
        success: false,
        message: `Active (${active}) + Inactive (${inactive}) must equal Total (${total})`,
      });
    }
    if (minR > maxR) {
      return res.status(400).json({
        success: false,
        message: 'Minimum range cannot be greater than maximum range',
      });
    }

    const profileData = {
      userId: req.user._id || req.user.id,
      totalDrones: total,
      activeDrones: active,
      inactiveDrones: inactive,
      maxRange: maxR,
      minRange: minR,
      location: {
        address: location.address,
        coordinates: {
          lat: location.lat ? Number(location.lat) : undefined,
          lng: location.lng ? Number(location.lng) : undefined,
        },
      },
      droneTypes:       Array.isArray(droneTypes) ? droneTypes.filter(Boolean) : [],
      maintenanceNotes: maintenanceNotes || '',
    };

    // ── Upsert: create new or update existing profile ─────
    const profile = await CompanyProfile.findOneAndUpdate(
      { userId: req.user._id || req.user.id },
      profileData,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({
      success: true,
      message: 'Company profile configured successfully!',
      data: profile,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msgs = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: msgs.join(', ') });
    }
    // Business rule error from pre-save hook
    if (err.message.includes('must equal') || err.message.includes('cannot exceed')) {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
};

// ─────────────────────────────────────────────────────────
// @route   GET /api/company/profile
// @access  Private
// @desc    Get the current user's company profile
// ─────────────────────────────────────────────────────────
const getCompanyProfile = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ userId: req.user._id || req.user.id })
      .populate('userId', 'name email username');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found. Please complete setup.',
        setupRequired: true,
      });
    }

    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
};

module.exports = { setupCompany, getCompanyProfile };
