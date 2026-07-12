const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },

  name: {
    type: String,
    required: true
  },

  type: {
    type: String,
    required: true
  },

  maxLoadCapacity: {
    type: Number,
    required: true
  },

  odometer: {
    type: Number,
    default: 0,
    min: 0
  },

  acquisitionCost: {
    type: Number,
    default: 0,
    min: 0
  },

  status: {
    type: String,
    enum: ["Available", "On Trip", "In Shop", "Retired"],
    default: "Available"
  }

}, { timestamps: true });

module.exports = mongoose.model("Vehicle", vehicleSchema);
