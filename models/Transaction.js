const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: true,
    },
    type: {
      type: String,
      enum: ['Check-Out', 'Check-In'],
      required: true,
    },
    takenBy: {
      type: String,
      required: true,
      trim: true,
    },
    constructionSite: {
      type: String,
      trim: true,
    },
    expectedReturnDate: {
      type: Date,
    },
    actualReturnDate: {
      type: Date,
    },
    conditionOnReturn: {
      type: String,
      default: 'Good',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;