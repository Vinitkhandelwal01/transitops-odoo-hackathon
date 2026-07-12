const express = require("express");
const router = express.Router();

const { getSettings, updateSettings, getRbacMatrix } = require("../controllers/settingsController");

router.get("/", getSettings);
router.put("/", updateSettings);
router.get("/rbac", getRbacMatrix);

module.exports = router;
