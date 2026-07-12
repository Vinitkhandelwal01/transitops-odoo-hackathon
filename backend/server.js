const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const tripRoutes = require('./routes/tripRoutes');
const driverSafetyRoutes = require('./routes/driverSafetyRoutes');
const Vehicle = require('./models/Vehicle');
const Driver = require('./models/Driver');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/trips', tripRoutes);
app.use('/api/driver-safety', driverSafetyRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/transitops_dev';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
