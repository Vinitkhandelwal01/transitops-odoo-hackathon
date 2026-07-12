const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const vehicleRoutes = require("./vehicleRoutes");
const tripRoutes = require("./tripRoutes");
const maintenanceRoutes = require("./maintenanceRoutes");
const fuelRoutes = require("./fuelRoutes");
const expenseRoutes = require("./expenseRoutes");
const reportsRoutes = require("./reportsRoutes");

router.use("/auth", authRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/trips", tripRoutes);
router.use("/maintenance", maintenanceRoutes);
router.use("/fuel", fuelRoutes);
router.use("/expenses", expenseRoutes);
router.use("/reports", reportsRoutes);
router.use("/driver-safety", driverSafetyRoutes);

module.exports = router;
