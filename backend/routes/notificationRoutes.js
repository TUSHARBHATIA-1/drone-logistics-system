const express = require('express');
const router = express.Router();
const { getNotifications, markRead, markAllRead, deleteNotification } = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);
router.get('/', getNotifications);
router.put('/read-all', markAllRead);
router.put('/:id', markRead);
router.delete('/:id', deleteNotification);

module.exports = router;
