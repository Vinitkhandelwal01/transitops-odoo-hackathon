const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');
const Vehicle = require('./models/Vehicle');
const Driver = require('./models/Driver');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/transitops_dev';

const seedData = async () => {
  try {
    // 1. Seed Vehicles
    const vehicleCount = await Vehicle.countDocuments();
    let seededVehicles = [];
    if (vehicleCount === 0) {
      seededVehicles = await Vehicle.create([
        { registrationNumber: 'MH-12-AB-1234', name: 'Tata Ace', type: 'Van', maxLoadCapacity: 1000, capacity: 1000, odometer: 15000, acquisitionCost: 650000, status: 'Available' },
        { registrationNumber: 'DL-01-XY-5678', name: 'Ashok Leyland Dost', type: 'Truck', maxLoadCapacity: 2000, capacity: 2000, odometer: 32000, acquisitionCost: 900000, status: 'Available' },
        { registrationNumber: 'KA-03-MM-9012', name: 'Mahindra Supro', type: 'Mini', maxLoadCapacity: 1200, capacity: 1200, odometer: 8000, acquisitionCost: 720000, status: 'Available' }
      ]);
      console.log('Vehicles seeded.');
    } else {
      seededVehicles = await Vehicle.find();
    }

    // 2. Seed Drivers
    const driverCount = await Driver.countDocuments();
    let seededDrivers = [];
    if (driverCount === 0) {
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 2);
      seededDrivers = await Driver.create([
        { name: 'John Doe', licenseNumber: 'DL123456', licenseExpiryDate: expiry, status: 'Available' },
        { name: 'Jane Smith', licenseNumber: 'MH987654', licenseExpiryDate: expiry, status: 'Available' }
      ]);
      console.log('Drivers seeded.');
    } else {
      seededDrivers = await Driver.find();
    }

    // 3. Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const defaultPassword = await bcrypt.hash("password123", salt);

      await User.create([
        { name: 'Fleet Manager User', email: 'manager@transitops.com', password: defaultPassword, role: 'Fleet Manager' },
        { name: 'Dispatcher User', email: 'dispatcher@transitops.com', password: defaultPassword, role: 'Dispatcher' },
        { name: 'Driver User', email: 'driver@transitops.com', password: defaultPassword, role: 'Driver' },
        { name: 'Safety Officer User', email: 'safety@transitops.com', password: defaultPassword, role: 'Safety Officer' },
        { name: 'Financial Analyst User', email: 'finance@transitops.com', password: defaultPassword, role: 'Financial Analyst' }
      ]);
      console.log('Default users seeded.');
    }
  } catch (error) {
    console.error('Data seeding failed:', error);
  }
};

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await seedData();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
