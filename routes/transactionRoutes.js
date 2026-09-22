const express = require('express');
const router = express.Router();
const {
  getAllTransactions,
  createCheckOut,
  createCheckIn,
} = require('../controllers/transactionController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Anyone logged in can view history
router.get('/', protect, getAllTransactions);

// Both Admin and Staff can check equipment out and in
router.post('/checkout', protect, restrictTo('Admin', 'Staff'), createCheckOut);
router.post('/checkin', protect, restrictTo('Admin', 'Staff'), createCheckIn);

module.exports = router;