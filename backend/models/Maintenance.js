const mongoose = require("mongoose");
const Vehicle = require("./Vehicle");

const maintenanceSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
      trim: true,
    },
    maintenanceType: {
      type: String,
      enum: ["Scheduled", "Preventive", "Corrective", "Other"],
      required: true,
    },
    cost: {
      type: Number,
      required: true,
      min: [0, "Cost cannot be negative"],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return value >= this.startDate;
        },
        message: "End Date cannot be before Start Date",
      },
    },
    odometer: {
      type: Number,
      min: [0, "Odometer cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Scheduled", "In Progress", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Helper function to update vehicle status based on open maintenance items
async function updateVehicleStatus(vehicleId) {
  const openMaintenance = await mongoose.model("Maintenance").findOne({
    vehicleId: vehicleId,
    status: { $in: ["Scheduled", "In Progress"] },
  });

  const status = openMaintenance ? "In Shop" : "Available";
  await Vehicle.findByIdAndUpdate(vehicleId, { status });
}

// Post save hook
maintenanceSchema.post("save", async function (doc) {
  await updateVehicleStatus(doc.vehicleId);
});

// Post remove hook
maintenanceSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await updateVehicleStatus(doc.vehicleId);
  }
});

module.exports = mongoose.model("Maintenance", maintenanceSchema);
