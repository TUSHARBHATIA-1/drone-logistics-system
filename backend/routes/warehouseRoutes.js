const express = require('express');
const router = express.Router();
const { getWarehouses, addWarehouse } = require('../controllers/warehouseController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);
router.get('/', getWarehouses);
router.post('/', addWarehouse);

module.exports = router;
