const express = require('express');
const router = express.Router();
const { getMarketplaceItems, checkoutMarketplace, sellDrone, repairDrone } = require('../controllers/marketplaceController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);
router.get('/', getMarketplaceItems);
router.post('/checkout', checkoutMarketplace);
router.post('/sell/:id', sellDrone);
router.post('/repair/:id', repairDrone);

module.exports = router;
