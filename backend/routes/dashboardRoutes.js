const express = require("express");
const router = express.Router();

const { getKpis, getRecentTrips, getVehicleStatus } = require("../controllers/dashboardController");

// All roles can view the dashboard
router.get("/kpis", getKpis);
router.get("/recent-trips", getRecentTrips);
router.get("/vehicle-status", getVehicleStatus);

module.exports = router;
