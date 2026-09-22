const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Equipment name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Equipment type is required'],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    serialNumber: {
      type: String,
      required: [true, 'Serial number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['In Store', 'Checked Out', 'Under Maintenance', 'Retired'],
      default: 'In Store',
      index: true,
    },
    condition: {
      type: String,
      enum: ['New', 'Good', 'Fair', 'Poor', 'Damaged'],
      default: 'Good',
    },
    location: {
      type: String,
      trim: true,
      default: 'Main Store',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    purchaseDate: {
      type: Date,
    },
    purchasePrice: {
      type: Number,
      min: 0,
    },
    checkedOutTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    lastMaintenanceDate: {
      type: Date,
    },
    nextMaintenanceDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

equipmentSchema.index({ name: 'text', serialNumber: 'text', type: 'text' });

const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;