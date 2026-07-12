const Settings = require("../models/Settings");
const User = require("../models/User");

// ==========================================================
// @route   GET /api/settings
// @desc    Get general org settings (Depot Name, Currency, Distance Unit)
// ==========================================================
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSingleton();
    return res.status(200).json(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    return res.status(500).json({ message: "Failed to load settings" });
  }
};

// ==========================================================
// @route   PUT /api/settings
// @desc    Update general org settings ("Save changes" button)
// ==========================================================
exports.updateSettings = async (req, res) => {
  try {
    const { depotName, currency, distanceUnit } = req.body;

    const settings = await Settings.getSingleton();

    if (depotName !== undefined) settings.depotName = depotName;
    if (currency !== undefined) settings.currency = currency;
    if (distanceUnit !== undefined) settings.distanceUnit = distanceUnit;

    await settings.save();

    return res.status(200).json({ message: "Settings updated successfully", settings });
  } catch (error) {
    console.error("Update settings error:", error);
    return res.status(500).json({ message: "Failed to update settings" });
  }
};

// ==========================================================
// @route   GET /api/settings/rbac
// @desc    Returns the Role-Based Access matrix for the Settings table
//          Converts internal "full/view/none" into the mockup's "check/view/--"
// ==========================================================
exports.getRbacMatrix = async (req, res) => {
  try {
    const matrix = User.ROLE_ACCESS_MATRIX;

    const displayValue = (level) => {
      if (level === "full") return "check";
      if (level === "view") return "view";
      return "--";
    };

    const permissions = Object.entries(matrix).map(([role, access]) => ({
      role,
      fleet: displayValue(access.fleet),
      drivers: displayValue(access.drivers),
      trips: displayValue(access.trips),
      fuel: displayValue(access.fuelExpenses),
      analytics: displayValue(access.analytics),
    }));

    return res.status(200).json(permissions);
  } catch (error) {
    console.error("RBAC matrix error:", error);
    return res.status(500).json({ message: "Failed to load RBAC matrix" });
  }
};
