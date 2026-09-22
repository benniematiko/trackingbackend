const express = require('express');
const router = express.Router();
const {
  getAllEquipment,
  createEquipment,
  updateEquipmentStatus,
  updateEquipment,
  deleteEquipment,
} = require('../controllers/equipmentController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Anyone logged in can view equipment
router.get('/', protect, getAllEquipment);

// Only Admin can create new equipment
router.post('/', protect, restrictTo('Admin'), createEquipment);

// Only Admin can manually change status
router.patch('/:id/status', protect, restrictTo('Admin'), updateEquipmentStatus);

// Only Admin can edit full equipment record
router.put('/:id', protect, restrictTo('Admin'), updateEquipment);

// Only Admin can delete equipment
router.delete('/:id', protect, restrictTo('Admin'), deleteEquipment);

module.exports = router;