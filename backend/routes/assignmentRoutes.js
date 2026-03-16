const express = require('express');
const router = express.Router();
const { createAssignment, getAssignments, trackAssignment, cancelAssignment } = require('../controllers/assignmentController');
const { protect } = require('../middlewares/authMiddleware');
const { assignmentValidation } = require('../middlewares/validationMiddleware');

router.use(protect);
router.route('/').post(assignmentValidation, createAssignment).get(getAssignments);
router.route('/:id').get(trackAssignment).delete(cancelAssignment);

module.exports = router;
