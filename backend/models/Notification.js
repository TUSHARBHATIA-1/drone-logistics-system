const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['Battery', 'Success', 'Warning', 'Info', 'Rental'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    drone: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drone'
    },
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
