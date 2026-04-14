const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    // The rest of the fields kept for UI backward compatibility
    totalDrones: { type: Number, default: 0 },
    activeDrones: { type: Number, default: 0 },
    inactiveDrones: { type: Number, default: 0 },
    maxRange: { type: Number, default: 0 },
    minRange: { type: Number, default: 0 },
    droneTypes: [{ type: String }],
    maintenanceNotes: { type: String, default: "" },
    isSetupComplete: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Compound unique index on userId
companyProfileSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('CompanyProfile', companyProfileSchema);