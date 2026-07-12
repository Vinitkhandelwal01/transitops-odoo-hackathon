const FuelLog = require("../models/FuelLog");
const Vehicle = require("../models/Vehicle");

exports.getFuelLogs = async (req, res) => {
  try {
    const { vehicleId } = req.query;
    const query = {};
    if (vehicleId) query.vehicleId = vehicleId;

    const logs = await FuelLog.find(query)
      .populate("vehicleId")
      .populate("driverId")
      .sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createFuelLog = async (req, res) => {
  try {
    const { vehicleId, driverId, date, odometer, fuelQty, cost, station, fuelType, notes } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    if (odometer < vehicle.odometer) {
      return res.status(400).json({
        message: `Odometer reading (${odometer}) cannot be less than vehicle's current odometer (${vehicle.odometer})`,
      });
    }

    const log = new FuelLog({
      vehicleId,
      driverId,
      date,
      odometer,
      fuelQty,
      cost,
      station,
      fuelType,
      notes,
    });

    await log.save();

    // Update vehicle odometer
    vehicle.odometer = odometer;
    await vehicle.save();

    res.status(201).json(await log.populate("vehicleId driverId"));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
