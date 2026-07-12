const Maintenance = require("../models/Maintenance");
const Vehicle = require("../models/Vehicle");

// Get all maintenance records
exports.getMaintenances = async (req, res) => {
  try {
    const { vehicleId, status } = req.query;
    const query = {};
    if (vehicleId) query.vehicleId = vehicleId;
    if (status) query.status = status;

    const records = await Maintenance.find(query)
      .populate("vehicleId")
      .sort({ startDate: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a maintenance record
exports.createMaintenance = async (req, res) => {
  try {
    const { vehicleId, serviceType, maintenanceType, cost, startDate, endDate, odometer, status, notes } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    // Validate odometer is not less than vehicle's current odometer
    if (odometer && odometer < vehicle.odometer) {
      return res.status(400).json({
        message: `Odometer reading (${odometer}) cannot be less than vehicle's current odometer (${vehicle.odometer})`,
      });
    }

    const record = new Maintenance({
      vehicleId,
      serviceType,
      maintenanceType,
      cost,
      startDate,
      endDate,
      odometer,
      status,
      notes,
    });

    await record.save();

    // If odometer is updated, we update the vehicle's odometer
    if (odometer) {
      vehicle.odometer = odometer;
      await vehicle.save();
    }

    res.status(201).json(await record.populate("vehicleId"));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update maintenance record
exports.updateMaintenance = async (req, res) => {
  try {
    const { serviceType, maintenanceType, cost, startDate, endDate, odometer, status, notes } = req.body;

    const record = await Maintenance.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Maintenance record not found" });

    if (serviceType) record.serviceType = serviceType;
    if (maintenanceType) record.maintenanceType = maintenanceType;
    if (cost !== undefined) record.cost = cost;
    if (startDate) record.startDate = startDate;
    if (endDate !== undefined) record.endDate = endDate;
    if (notes !== undefined) record.notes = notes;

    if (odometer !== undefined) {
      const vehicle = await Vehicle.findById(record.vehicleId);
      if (vehicle && odometer > vehicle.odometer) {
        vehicle.odometer = odometer;
        await vehicle.save();
      }
      record.odometer = odometer;
    }

    if (status) record.status = status;

    await record.save();
    res.json(await record.populate("vehicleId"));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update status only
exports.updateMaintenanceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const record = await Maintenance.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Maintenance record not found" });

    record.status = status;
    await record.save();

    res.json(await record.populate("vehicleId"));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete maintenance record
exports.deleteMaintenance = async (req, res) => {
  try {
    const record = await Maintenance.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Maintenance record not found" });
    res.json({ message: "Maintenance record deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
