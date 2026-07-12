const express = require("express");
const router = express.Router();

const { getSettings, updateSettings, getRbacMatrix } = require("../controllers/settingsController");
const { protect, authorize } = require("../middleware/Auth");

router.get("/", protect, getSettings);
router.put("/", protect, authorize("Fleet Manager"), updateSettings); // only Fleet Manager (admin-like) can save changes
router.get("/rbac", protect, getRbacMatrix);

module.exports = router;
