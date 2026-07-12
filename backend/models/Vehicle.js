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

  capacity: {
    type: Number
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

vehicleSchema.pre("validate", function (next) {
  if (this.capacity && !this.maxLoadCapacity) {
    this.maxLoadCapacity = this.capacity;
  } else if (this.maxLoadCapacity && !this.capacity) {
    this.capacity = this.maxLoadCapacity;
  }
  next();
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
