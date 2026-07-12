const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle");

// GET all vehicles
router.get("/", async (req, res) => {
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
});

// ADD vehicle
router.post("/", async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);

    await vehicle.save();

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// UPDATE vehicle
router.put("/:id", async (req, res) => {
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
});

// DELETE vehicle
router.delete("/:id", async (req, res) => {
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
});

module.exports = router;