const DriverSafetyProfile = require('../models/DriverSafetyProfile');

// GET ALL DRIVER SAFETY PROFILES
exports.getDriverSafetyProfiles = async (req, res) => {
  try {
    const drivers = await DriverSafetyProfile
      .find()
      .sort({ createdAt: -1 });

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
    const driver = await DriverSafetyProfile.create(req.body);

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
    const driver = await DriverSafetyProfile.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      {
        new: true,
        runValidators: true
      }
    );

    if (!driver) {
      return res.status(404).json({
        message: 'Driver not found'
      });
    }

    res.status(200).json(driver);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};