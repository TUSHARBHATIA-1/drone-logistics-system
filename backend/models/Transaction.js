const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['rent', 'buy', 'repair'],
        required: [true, 'Please specify transaction type']
    },
    droneId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Drone',
        required: true
    },
    cost: {
        type: Number,
        required: [true, 'Please add transaction cost']
    },
    companyId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
