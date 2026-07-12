const express = require("express");
const router = express.Router();
const maintenanceController = require("../controllers/maintenanceController");

router.get("/", maintenanceController.getMaintenances);
router.post("/", maintenanceController.createMaintenance);
router.put("/:id", maintenanceController.updateMaintenance);
router.patch("/:id/status", maintenanceController.updateMaintenanceStatus);
router.delete("/:id", maintenanceController.deleteMaintenance);

module.exports = router;
