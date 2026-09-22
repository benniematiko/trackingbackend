const Equipment = require('../models/Equipment');

// Get all equipment (supports search, filter, sort, pagination)
const getAllEquipment = async (req, res) => {
  try {
    const { search, status, category, sortBy, order, page, limit } = req.query;

    const query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    const sortField = sortBy || 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 0; // 0 = no limit, return everything
    const skip = (pageNum - 1) * limitNum;

    let equipmentQuery = Equipment.find(query)
      .populate('checkedOutTo', 'name email')
      .populate('addedBy', 'name email')
      .sort({ [sortField]: sortOrder });

    if (limitNum > 0) {
      equipmentQuery = equipmentQuery.skip(skip).limit(limitNum);
    }

    const [equipment, total] = await Promise.all([
      equipmentQuery,
      Equipment.countDocuments(query),
    ]);

    res.json({
      equipment,
      total,
      page: pageNum,
      totalPages: limitNum > 0 ? Math.ceil(total / limitNum) : 1,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new equipment
const createEquipment = async (req, res) => {
  try {
    const newEquipment = new Equipment({
      ...req.body,
      addedBy: req.user._id, // set from the logged-in user, not the client
    });
    const savedEquipment = await newEquipment.save();
    res.status(201).json(savedEquipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update equipment status
const updateEquipmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Equipment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update full equipment record (edit)
const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;

    // Don't allow clients to overwrite these via edit form
    const { addedBy, checkedOutTo, ...safeUpdates } = req.body;

    const updated = await Equipment.findByIdAndUpdate(id, safeUpdates, {
      new: true,
      runValidators: true,
    })
      .populate('checkedOutTo', 'name email')
      .populate('addedBy', 'name email');

    if (!updated) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete equipment
const deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Equipment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllEquipment,
  createEquipment,
  updateEquipmentStatus,
  updateEquipment,
  deleteEquipment,
};