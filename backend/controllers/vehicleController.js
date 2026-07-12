const Vehicle = require("../models/Vehicle");

const calculateMaintenanceRisk = (vehicle) => {
  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - Number(vehicle.manufacturingYear || currentYear));
  const odometer = Number(vehicle.odometer || 0);
  let riskScore = 0;

  if (odometer > 100000) riskScore += 50;
  else if (odometer > 50000) riskScore += 30;
  else riskScore += 10;

  if (age > 8) riskScore += 30;
  else if (age > 4) riskScore += 20;

  let riskLevel = "LOW";
  if (riskScore >= 60) riskLevel = "HIGH";
  else if (riskScore >= 30) riskLevel = "MEDIUM";

  return { riskScore, riskLevel };
};

exports.getVehicles = async (req, res) => {
  try {
    const { search = "", type = "", status = "" } = req.query;
    const query = {};
    if (search) query.$or = [
      { registrationNumber: { $regex: search, $options: "i" } },
      { name: { $regex: search, $options: "i" } }
    ];
    if (type) query.type = type;
    if (status) query.status = status;
    res.json(await Vehicle.find(query).sort({ createdAt: -1 }));
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.createVehicle = async (req, res) => {
  try {
    const risk = calculateMaintenanceRisk(req.body);
    const vehicle = await Vehicle.create({
      ...req.body,
      maintenanceRiskScore: risk.riskScore,
      maintenanceRiskLevel: risk.riskLevel
    });
    res.status(201).json(vehicle);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: "Registration number must be unique" });
    res.status(400).json({ message: error.message });
  }
};

exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (error) { res.status(400).json({ message: error.message }); }
};

exports.updateVehicle = async (req, res) => {
  try {
    const existingVehicle = await Vehicle.findById(req.params.id);
    if (!existingVehicle) return res.status(404).json({ message: "Vehicle not found" });

    const updatedData = { ...existingVehicle.toObject(), ...req.body };
    const risk = calculateMaintenanceRisk(updatedData);

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        maintenanceRiskScore: risk.riskScore,
        maintenanceRiskLevel: risk.riskLevel
      },
      { new: true, runValidators: true }
    );
    res.json(vehicle);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: "Registration number must be unique" });
    res.status(400).json({ message: error.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    if (vehicle.status === "On Trip") return res.status(400).json({ message: "Cannot delete a vehicle currently On Trip" });
    await vehicle.deleteOne();
    res.json({ message: "Vehicle deleted" });
  } catch (error) { res.status(400).json({ message: error.message }); }
