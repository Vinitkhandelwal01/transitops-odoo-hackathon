const mongoose = require("mongoose");

const fuelLogSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    odometer: {
      type: Number,
      required: true,
      min: [0, "Odometer cannot be negative"],
    },
    fuelQty: {
      type: Number, // In Liters
      required: true,
      min: [0, "Fuel quantity cannot be negative"],
    },
    cost: {
      type: Number,
      required: true,
      min: [0, "Cost cannot be negative"],
    },
    station: {
      type: String,
      trim: true,
    },
    fuelType: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FuelLog", fuelLogSchema);
