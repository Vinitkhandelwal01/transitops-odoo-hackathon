const DriverSafetyProfile = require('../models/DriverSafetyProfile');

// GET ALL DRIVER SAFETY PROFILES
exports.getDriverSafetyProfiles = async (req, res) => {
  try {
    const drivers = await DriverSafetyProfile
      .find()
      .sort({ createdAt: -1 });

    const now = new Date();

    await Promise.all(
      drivers.map(async (driver) => {
        if (driver.licenseExpiryDate < now && driver.safetyStatus !== 'Suspended') {
          driver.safetyStatus = 'Suspended';
          driver.status = 'Suspended';
          await driver.save();
        }
      })
    );

    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// ADD DRIVER
exports.createDriverSafetyProfile = async (req, res) => {
  try {
    const driverData = { ...req.body };

    if (new Date(driverData.licenseExpiryDate) < new Date()) {
      driverData.safetyStatus = 'Suspended';
      driverData.status = 'Suspended';
    }

    const driver = await DriverSafetyProfile.create(driverData);

    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// UPDATE DRIVER STATUS
exports.updateDriverStatus = async (req, res) => {
  try {
    const driver = await DriverSafetyProfile.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({
        message: 'Driver not found'
      });
    }

    if (driver.licenseExpiryDate < new Date()) {
      driver.safetyStatus = 'Suspended';
      driver.status = 'Suspended';
      await driver.save();

      return res.status(400).json({
        message: 'Expired license driver cannot be assigned to a trip',
        driver
      });
    }

    driver.status = req.body.status;
    driver.safetyStatus = req.body.status === 'Suspended'
      ? 'Suspended'
      : req.body.status === 'On Trip'
        ? 'On Trip'
        : 'Available';

    await driver.save();

    res.status(200).json(driver);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};