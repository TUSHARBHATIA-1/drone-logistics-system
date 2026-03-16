const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    deliveryId: {
        type: String,
        required: [true, 'Please add a unique delivery ID'],
        unique: true,
        trim: true
    },
    pickupLocation: {
        type: String,
        required: [true, 'Please add a pickup location']
    },
    deliveryLocations: [{
        address: { type: String, required: true },
        coordinates: {
            lat: Number,
            lng: Number
        }
    }],
    packageWeight: {
        type: Number,
        required: [true, 'Please add package weight (kg)']
    },
    assignedDrone: {
        type: mongoose.Schema.ObjectId,
        ref: 'Drone'
    },
    route: {
        type: [String], // Array of coordinates or node names from Dijkstra
        default: []
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'in-transit', 'delivered', 'cancelled'],
        default: 'pending'
    },
    deadline: {
        type: Date,
        required: [true, 'Please add a delivery deadline']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Assignment', assignmentSchema);
