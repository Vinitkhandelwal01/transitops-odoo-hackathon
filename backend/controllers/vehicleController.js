const Vehicle = require("../models/Vehicle");

// Get all vehicles
exports.getVehicles = async (req, res) => {
  try {
    const { search, type, status } = req.query;

    const query = {};

    if (search) {
      query.registrationNumber = {
        $regex: search,
        $options: "i"
      };
    }

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    const vehicles = await Vehicle.find(query).sort({
      createdAt: -1
    });

    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Create vehicle
exports.createVehicle = async (req, res) => {
  try {
    const existingVehicle = await Vehicle.findOne({
      registrationNumber: req.body.registrationNumber
    });

    if (existingVehicle) {
      return res.status(400).json({
        message: "Registration number already exists"
      });
    }

    const vehicle = new Vehicle(req.body);

    await vehicle.save();

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Get vehicle by ID
exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Update vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Delete vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(
      req.params.id
    );

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    res.status(200).json({
      message: "Vehicle deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};