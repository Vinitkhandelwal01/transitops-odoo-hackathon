const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, enum: ["Van", "Truck", "Mini", "Bus", "Car", "Other"] },
  capacity: { type: Number, required: true, min: 1 },
  odometer: { type: Number, default: 0, min: 0 },
  acquisitionCost: { type: Number, default: 0, min: 0 },
  manufacturingYear: { type: Number, default: () => new Date().getFullYear() },
  maintenanceRiskScore: { type: Number, default: 0, min: 0 },
  maintenanceRiskLevel: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH"],
    default: "LOW"
  },
  status: { type: String, enum: ["Available", "On Trip", "In Shop", "Retired"], default: "Available" }
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", vehicleSchema);
