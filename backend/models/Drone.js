const mongoose = require('mongoose');

const droneSchema = new mongoose.Schema({
    droneId: {
        type: String,
        required: [true, 'Please add a unique drone ID'],
        unique: true,
        trim: true
    },
    modelNumber: {
        type: String,
        required: [true, 'Please add a model number']
    },
    maxWeight: {
        type: Number,
        required: [true, 'Please add maximum carrying weight (kg)']
    },
    batteryCapacity: {
        type: Number,
        required: [true, 'Please add battery capacity (mAh)']
    },
    maxDistance: {
        type: Number,
        required: [true, 'Please add maximum flight distance (km)']
    },
    currentBattery: {
        type: Number,
        required: [true, 'Please add current battery level (%)'],
        min: 0,
        max: 100
    },
    status: {
        type: String,
        enum: ['available', 'busy', 'charging', 'maintenance', 'retired'],
        default: 'available'
    },
    companyId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    currentLocation: {
        type: [Number],
        default: [28.6139, 77.2090] // HQ Warehouse
    },
    currentRoute: {
        type: [[Number]],
        default: []
    },
    assignedDelivery: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Drone', droneSchema);
