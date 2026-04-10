const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    totalDrones: {
      type: Number,
      required: true,
      min: 0,
    },
    activeDrones: {
      type: Number,
      required: true,
      min: 0,
    },
    inactiveDrones: {
      type: Number,
      required: true,
      min: 0,
    },

    maxRange: {
      type: Number,
      required: true,
      min: 0,
    },
    minRange: {
      type: Number,
      required: true,
      min: 0,
    },

    location: {
      address: {
        type: String,
        required: true,
        trim: true,
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },

    droneTypes: [{ type: String }],
    maintenanceNotes: { type: String },

    isSetupComplete: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Index (important)
companyProfileSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('CompanyProfile', companyProfileSchema);