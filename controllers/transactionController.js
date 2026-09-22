const Transaction = require('../models/Transaction');
const Equipment = require('../models/Equipment');

// Get all transactions (history)
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('equipment', 'name serialNumber type')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a Check-Out
const createCheckOut = async (req, res) => {
  try {
    const { equipmentId, takenBy, constructionSite, expectedReturnDate, notes } = req.body;

    // 1. Find the equipment
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // 2. Make sure it is currently "In Store"
    if (equipment.status !== 'In Store') {
      return res.status(400).json({ message: 'Equipment is not available for check-out' });
    }

    // 3. Create the transaction
    const transaction = new Transaction({
      equipment: equipmentId,
      type: 'Check-Out',
      takenBy,
      constructionSite,
      expectedReturnDate,
      notes,
    });

    await transaction.save();

    // 4. Update the equipment status
    equipment.status = 'Checked Out';
    await equipment.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create a Check-In
const createCheckIn = async (req, res) => {
  try {
    const { equipmentId, conditionOnReturn, notes } = req.body;

    // 1. Find the equipment
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // 2. Make sure it is currently "Checked Out"
    if (equipment.status !== 'Checked Out') {
      return res.status(400).json({ message: 'Equipment is not currently checked out' });
    }

    // 3. Create the transaction
    const transaction = new Transaction({
      equipment: equipmentId,
      type: 'Check-In',
      takenBy: 'Returned',
      actualReturnDate: new Date(),
      conditionOnReturn,
      notes,
    });

    await transaction.save();

    // 4. Update the equipment status and condition
    equipment.status = 'In Store';
    equipment.condition = conditionOnReturn || 'Good';
    await equipment.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllTransactions,
  createCheckOut,
  createCheckIn,
};