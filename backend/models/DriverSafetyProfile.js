const mongoose = require('mongoose');

const driverSafetyProfileSchema = new mongoose.Schema({
  driverName: {
    type: String,
    required: true,
    trim: true
  },

  licenseNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },

  category: {
    type: String,
    enum: ['LMV', 'HMV'],
    required: true
  },

  licenseExpiryDate: {
    type: Date,
    required: true
  },

  contact: {
    type: String,
    required: true
  },

  tripCompletion: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  safetyStatus: {
    type: String,
    enum: ['Available', 'Suspended', 'On Trip'],
    default: 'Available'
  },

  status: {
    type: String,
    enum: ['Available', 'On Trip', 'Off Duty', 'Suspended'],
    default: 'Available'
  }
}, { timestamps: true });

driverSafetyProfileSchema.virtual('isLicenseExpired').get(function () {
  return this.licenseExpiryDate < new Date();
});

module.exports = mongoose.model(
  'DriverSafetyProfile',
  driverSafetyProfileSchema
);