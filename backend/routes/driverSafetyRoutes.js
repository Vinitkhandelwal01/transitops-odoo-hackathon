const express = require('express');

const {
  getDriverSafetyProfiles,
  createDriverSafetyProfile,
  updateDriverStatus
} = require('../controllers/driverSafetyController');

const router = express.Router();

router.get('/', getDriverSafetyProfiles);

router.post('/', createDriverSafetyProfile);

router.patch('/:id/status', updateDriverStatus);

module.exports = router;