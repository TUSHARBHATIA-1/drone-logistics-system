const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one profile per company
    },

    // ── Drone Fleet ───────────────────────────────────────
    totalDrones: {
      type: Number,
      required: [true, 'Total number of drones is required'],
      min: [0, 'Total drones cannot be negative'],
    },
    activeDrones: {
      type: Number,
      required: [true, 'Active drone count is required'],
      min: [0, 'Active drones cannot be negative'],
    },
    inactiveDrones: {
      type: Number,
      required: [true, 'Inactive drone count is required'],
      min: [0, 'Inactive drones cannot be negative'],
    },

    // ── Operational Ranges ────────────────────────────────
    maxRange: {
      type: Number,
      required: [true, 'Maximum range is required'],
      min: [0, 'Max range cannot be negative'],
    },
    minRange: {
      type: Number,
      required: [true, 'Minimum range is required'],
      min: [0, 'Min range cannot be negative'],
    },

    // ── Location ──────────────────────────────────────────
    location: {
      address: {
        type: String,
        required: [true, 'Warehouse location is required'],
        trim: true,
      },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },

    // ── Optional Details ──────────────────────────────────
    droneTypes: [{ type: String, trim: true }],
    maintenanceNotes: { type: String, trim: true, maxlength: 1000 },
    isSetupComplete: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ── Business rule: activeDrones + inactiveDrones must equal totalDrones ──
companyProfileSchema.pre('save', function (next) {
  if (this.activeDrones + this.inactiveDrones !== this.totalDrones) {
    return next(
      new Error(
        `Active drones (${this.activeDrones}) + inactive drones (${this.inactiveDrones}) must equal total drones (${this.totalDrones})`
      )
    );
  }
  if (this.minRange > this.maxRange) {
    return next(new Error('Minimum range cannot exceed maximum range'));
  }
  next();
});

module.exports = mongoose.model('CompanyProfile', companyProfileSchema);
