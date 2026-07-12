const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

// Get all trips
exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find().populate('vehicle').populate('driver').sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new trip
exports.createTrip = async (req, res) => {
  try {
    const { source, destination, vehicle, driver, cargoWeight, plannedDistance } = req.body;

    // Validate Vehicle Capacity
    const vehicleObj = await Vehicle.findById(vehicle);
    if (!vehicleObj) return res.status(404).json({ message: 'Vehicle not found' });
    if (cargoWeight > vehicleObj.maxLoadCapacity) {
      return res.status(400).json({ message: `Cargo weight exceeds vehicle capacity of ${vehicleObj.maxLoadCapacity} kg` });
    }

    // Check Availability
    if (vehicleObj.status !== 'Available') {
      return res.status(400).json({ message: 'Vehicle is not available' });
    }

    const driverObj = await Driver.findById(driver);
    if (!driverObj) return res.status(404).json({ message: 'Driver not found' });
    if (driverObj.status !== 'Available') {
      return res.status(400).json({ message: 'Driver is not available' });
    }
    if (new Date(driverObj.licenseExpiryDate) <= new Date()) {
      return res.status(400).json({ message: 'Driver license has expired' });
    }

    const newTrip = new Trip({
      source, destination, vehicle, driver, cargoWeight, plannedDistance, status: 'Draft'
    });

    await newTrip.save();
    res.status(201).json(await newTrip.populate('vehicle driver'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Trip Status
exports.updateTripStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const tripId = req.params.id;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const vehicle = await Vehicle.findById(trip.vehicle);
    const driver = await Driver.findById(trip.driver);

    if (status === 'Dispatched') {
      if (vehicle.status !== 'Available' || driver.status !== 'Available') {
        return res.status(400).json({ message: 'Cannot dispatch. Vehicle or Driver is not available.' });
      }
      vehicle.status = 'On Trip';
      driver.status = 'On Trip';
    } 
    else if (status === 'Completed' || status === 'Cancelled') {
      vehicle.status = 'Available';
      driver.status = 'Available';
    }

    trip.status = status;

    await Promise.all([vehicle.save(), driver.save(), trip.save()]);

    res.status(200).json(await trip.populate('vehicle driver'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available Vehicles
exports.getAvailableVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ status: 'Available' });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available Drivers
exports.getAvailableDrivers = async (req, res) => {
  try {
    const currentDate = new Date();
    const drivers = await Driver.find({ 
      status: 'Available',
      licenseExpiryDate: { $gt: currentDate }
    });
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
