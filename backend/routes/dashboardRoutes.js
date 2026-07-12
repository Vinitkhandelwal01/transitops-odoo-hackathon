const express = require("express");
const router = express.Router();

const { getKpis, getRecentTrips, getVehicleStatus } = require("../controllers/dashboardController");
const { protect } = require("../middleware/Auth");

// All roles can view the dashboard (per mockup: Dispatcher -> Dashboard, but
// KPI cards are useful to every role, so we only require login, not a specific role)
router.get("/kpis", protect, getKpis);
router.get("/recent-trips", protect, getRecentTrips);
router.get("/vehicle-status", protect, getVehicleStatus);

module.exports = router;
