const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

// Get all trips
exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate('vehicle')
      .populate('driver')
      .sort({ createdAt: -1 });

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new trip
exports.createTrip = async (req, res) => {
  try {
    const {
      source,
      destination,
      vehicle,
      driver,
      cargoWeight,
      plannedDistance
    } = req.body;

    // Validate Vehicle
    const vehicleObj = await Vehicle.findById(vehicle);

    if (!vehicleObj) {
      return res.status(404).json({
        message: 'Vehicle not found'
      });
    }

    // Validate Vehicle Capacity
    if (cargoWeight > vehicleObj.maxLoadCapacity) {
      return res.status(400).json({
        message: `Cargo weight exceeds vehicle capacity of ${vehicleObj.maxLoadCapacity} kg`
      });
    }

    // Check Vehicle Availability
    if (vehicleObj.status !== 'Available') {
      return res.status(400).json({
        message: 'Vehicle is not available'
      });
    }

    // Validate Driver
    const driverObj = await Driver.findById(driver);

    if (!driverObj) {
      return res.status(404).json({
        message: 'Driver not found'
      });
    }

    // Driver Safety & Compliance Check
    if (
      driverObj.status === 'Suspended' ||
      new Date(driverObj.licenseExpiryDate) <= new Date()
    ) {
      return res.status(400).json({
        message:
          'Cannot assign driver. Driver license expired or driver is suspended.'
      });
    }

    // Check Driver Availability
    if (driverObj.status !== 'Available') {
      return res.status(400).json({
        message: 'Driver is not available'
      });
    }

    // Create Trip
    const newTrip = new Trip({
      source,
      destination,
      vehicle,
      driver,
      cargoWeight,
      plannedDistance,
      status: 'Draft'
    });

    await newTrip.save();

    res.status(201).json(
      await newTrip.populate('vehicle driver')
    );
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Update Trip Status
exports.updateTripStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const tripId = req.params.id;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found'
      });
    }

    const vehicle = await Vehicle.findById(trip.vehicle);
    const driver = await Driver.findById(trip.driver);

    if (!vehicle) {
      return res.status(404).json({
        message: 'Vehicle not found'
      });
    }

    if (!driver) {
      return res.status(404).json({
        message: 'Driver not found'
      });
    }

    // Dispatch Trip
    if (status === 'Dispatched') {

      // Check Vehicle Availability
      if (vehicle.status !== 'Available') {
        return res.status(400).json({
          message: 'Cannot dispatch. Vehicle is not available.'
        });
      }

      // Driver Safety & Compliance Check
      if (
        driver.status === 'Suspended' ||
        new Date(driver.licenseExpiryDate) <= new Date()
      ) {
        return res.status(400).json({
          message:
            'Cannot dispatch. Driver license expired or driver is suspended.'
        });
      }

      // Check Driver Availability
      if (driver.status !== 'Available') {
        return res.status(400).json({
          message: 'Cannot dispatch. Driver is not available.'
        });
      }

      vehicle.status = 'On Trip';
      driver.status = 'On Trip';
    }

    // Complete or Cancel Trip
    else if (
      status === 'Completed' ||
      status === 'Cancelled'
    ) {
      vehicle.status = 'Available';

      // Do not make expired drivers Available
      if (new Date(driver.licenseExpiryDate) <= new Date()) {
        driver.status = 'Suspended';
      } else if (driver.status !== 'Suspended') {
        driver.status = 'Available';
      }
    }

    trip.status = status;

    await Promise.all([
      vehicle.save(),
      driver.save(),
      trip.save()
    ]);

    res.status(200).json(
      await trip.populate('vehicle driver')
    );
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get Available Vehicles
exports.getAvailableVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      status: 'Available'
    });

    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get Available Drivers
exports.getAvailableDrivers = async (req, res) => {
  try {
    const currentDate = new Date();

    const drivers = await Driver.find({
      status: 'Available',
      licenseExpiryDate: {
        $gt: currentDate
      }
    });

    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
