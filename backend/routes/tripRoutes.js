const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

router.get('/', tripController.getTrips);
router.post('/', tripController.createTrip);
router.patch('/:id/status', tripController.updateTripStatus);

router.get('/vehicles/available', tripController.getAvailableVehicles);
router.get('/drivers/available', tripController.getAvailableDrivers);

module.exports = router;
