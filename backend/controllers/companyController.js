const CompanyProfile = require('../models/CompanyProfile');

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

    // Validation
    if (!location?.address) {
      return res.status(400).json({
        success: false,
        message: "Location address is required",
      });
    }

    const total = Number(totalDrones);
    const active = Number(activeDrones);
    const inactive = Number(inactiveDrones);
    const maxR = Number(maxRange);
    const minR = Number(minRange);

    if (active + inactive !== total) {
      return res.status(400).json({
        success: false,
        message: "Active + Inactive must equal Total drones",
      });
    }

    if (minR > maxR) {
      return res.status(400).json({
        success: false,
        message: "Min range cannot exceed max range",
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
          lat: location?.coordinates?.lat
            ? Number(location.coordinates.lat)
            : undefined,
          lng: location?.coordinates?.lng
            ? Number(location.coordinates.lng)
            : undefined,
        },
      },
      droneTypes: Array.isArray(droneTypes) ? droneTypes : [],
      maintenanceNotes: maintenanceNotes || "",
    };

    const profile = await CompanyProfile.findOneAndUpdate(
      { userId: req.user._id || req.user.id },
      profileData,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Company profile saved",
      data: profile,
    });

  } catch (err) {
    console.error("Company Setup Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getCompanyProfile = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({
      userId: req.user._id || req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.json({ success: true, data: profile });

  } catch (err) {
    console.error("Get Profile Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { setupCompany, getCompanyProfile };