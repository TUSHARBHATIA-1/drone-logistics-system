const Drone = require('../models/Drone');
const Transaction = require('../models/Transaction');

// @desc    Get all marketplace drones (available for sale/rent)
// @route   GET /api/marketplace
// @access  Private
const getMarketplaceItems = async (req, res, next) => {
    try {
        const items = [
            {
                _id: 'm1',
                modelNumber: 'SkyRaider v3',
                maxWeight: 15,
                batteryCapacity: 5000,
                maxDistance: 30,
                price: 4500,
                type: 'buy',
                category: 'Urban Delivery'
            },
            {
                _id: 'm2',
                modelNumber: 'Atlas Heavy-X',
                maxWeight: 60,
                batteryCapacity: 12000,
                maxDistance: 20,
                price: 150,
                type: 'rent',
                category: 'Industrial'
            },
            {
                _id: 'm3',
                modelNumber: 'Raven Stealth',
                maxWeight: 5,
                batteryCapacity: 3000,
                maxDistance: 80,
                price: 9000,
                type: 'buy',
                category: 'Surveillance'
            }
        ];
        res.status(200).json({
            success: true,
            data: items
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Purchase or Rent a drone
// @route   POST /api/marketplace/checkout
// @access  Private
const checkoutMarketplace = async (req, res, next) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            res.status(400);
            throw new Error('No items in cart');
        }

        const processedDrones = [];
        const transactions = [];

        for (const item of items) {
            const drone = await Drone.create({
                companyId: req.user.id,
                modelNumber: item.modelNumber || 'Legacy Model',
                maxWeight: item.maxWeight || 10,
                batteryCapacity: item.batteryCapacity || 5000,
                maxDistance: item.maxDistance || 25,
                currentBattery: 100,
                status: item.type === 'rent' ? 'busy' : 'available'
            });

            const transaction = await Transaction.create({
                user: req.user.id,
                type: item.type === 'rent' ? 'Rental' : 'Purchase',
                amount: item.price,
                drone: drone._id,
                status: 'Completed'
            });

            processedDrones.push(drone);
            transactions.push(transaction);
        }

        res.status(201).json({
            success: true,
            message: 'Checkout successful',
            drones: processedDrones,
            transactions
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Sell a drone from fleet
// @route   POST /api/marketplace/sell/:id
// @access  Private
const sellDrone = async (req, res, next) => {
    try {
        const drone = await Drone.findById(req.params.id);

        if (!drone) {
            res.status(404);
            throw new Error('Drone not found');
        }

        if (drone.companyId.toString() !== req.user.id) {
            res.status(401);
            throw new Error('Not authorized to sell this drone');
        }

        const resaleValue = 2000; 

        await Transaction.create({
            user: req.user.id,
            type: 'Sale',
            amount: resaleValue,
            drone: drone._id,
            status: 'Completed'
        });

        await drone.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Drone sold successfully',
            resaleValue
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Request repair for a drone
// @route   POST /api/marketplace/repair/:id
// @access  Private
const repairDrone = async (req, res, next) => {
    try {
        const drone = await Drone.findById(req.params.id);

        if (!drone) {
            res.status(404);
            throw new Error('Drone not found');
        }

        if (drone.companyId.toString() !== req.user.id) {
            res.status(401);
            throw new Error('Not authorized');
        }

        drone.status = 'maintenance';
        await drone.save();

        await Transaction.create({
            user: req.user.id,
            type: 'Service',
            amount: 500,
            drone: drone._id,
            status: 'Pending'
        });

        res.status(200).json({
            success: true,
            message: 'Repair request submitted',
            data: drone
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMarketplaceItems,
    checkoutMarketplace,
    sellDrone,
    repairDrone
};
