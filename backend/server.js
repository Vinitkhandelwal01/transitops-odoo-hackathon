const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const tripRoutes = require('./routes/tripRoutes');
const Vehicle = require('./models/Vehicle');
const Driver = require('./models/Driver');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/trips', tripRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/transitops_dev';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Seed some mock data if empty
    const vCount = await Vehicle.countDocuments();
    if (vCount === 0) {
      await Vehicle.insertMany([
        { registrationNumber: 'VAN-05', name: 'Ford Transit', type: 'Van', maxLoadCapacity: 500, status: 'Available' },
        { registrationNumber: 'VAN-08', name: 'Mercedes Sprinter', type: 'Van', maxLoadCapacity: 800, status: 'Available' },
        { registrationNumber: 'TRUCK-04', name: 'Volvo FH16', type: 'Truck', maxLoadCapacity: 15000, status: 'Available' },
        { registrationNumber: 'TRUCK-09', name: 'Scania R500', type: 'Truck', maxLoadCapacity: 20000, status: 'In Shop' }, // Unavailable
        { registrationNumber: 'TRUCK-12', name: 'MAN TGX', type: 'Truck', maxLoadCapacity: 18000, status: 'On Trip' }, // Unavailable
      ]);
      console.log('Seeded mock vehicles');
    }

    const dCount = await Driver.countDocuments();
    if (dCount === 0) {
      await Driver.insertMany([
        { name: 'Alex Johnson', licenseNumber: 'LIC001', licenseExpiryDate: new Date('2028-01-01'), status: 'Available' },
        { name: 'Suresh Kumar', licenseNumber: 'LIC002', licenseExpiryDate: new Date('2029-01-01'), status: 'Available' },
        { name: 'Maria Garcia', licenseNumber: 'LIC003', licenseExpiryDate: new Date('2026-11-15'), status: 'Available' },
        { name: 'David Smith', licenseNumber: 'LIC004', licenseExpiryDate: new Date('2025-05-10'), status: 'Off Duty' }, // Unavailable
        { name: 'Priya Patel', licenseNumber: 'LIC005', licenseExpiryDate: new Date('2024-01-01'), status: 'Suspended' }, // Expired/Suspended
      ]);
      console.log('Seeded mock drivers');
    }

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
