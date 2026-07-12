const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const vehicleRoutes = require("./vehicleRoutes");
const tripRoutes = require("./tripRoutes");
const maintenanceRoutes = require("./maintenanceRoutes");
const fuelRoutes = require("./fuelRoutes");
const expenseRoutes = require("./expenseRoutes");
const reportsRoutes = require("./reportsRoutes");
const driverSafetyRoutes = require("./driverSafetyRoutes"); // was missing before -> was crashing the server
const dashboardRoutes = require("./dashboardRoutes");
const settingsRoutes = require("./settingsRoutes");

router.use("/auth", authRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/trips", tripRoutes);
router.use("/maintenance", maintenanceRoutes);
router.use("/fuel", fuelRoutes);
router.use("/expenses", expenseRoutes);
router.use("/reports", reportsRoutes);
router.use("/driver-safety", driverSafetyRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/settings", settingsRoutes);

module.exports = router;
