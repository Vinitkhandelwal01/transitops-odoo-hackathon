const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportsController");

router.get("/vehicle-costs/:vehicleId", reportsController.getVehicleCosts);
router.get("/export/csv", reportsController.exportCSV);
router.get("/export/pdf", reportsController.exportPDF);

module.exports = router;
