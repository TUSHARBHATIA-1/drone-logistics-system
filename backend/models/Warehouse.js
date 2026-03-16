const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
    location: {
        address: { type: String, required: true },
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    storageCapacity: {
        type: Number,
        required: [true, 'Please add storage capacity (units)']
    },
    dronesAvailable: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Drone'
    }],
    companyId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Warehouse', warehouseSchema);
