const User = require("../../models/User");

// resource: 'fleet', 'drivers', 'trips', 'fuelExpenses', 'analytics'
// requiredAccess: 'view' or 'full'
const authorize = (resource, requiredAccess = "view") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const role = req.user.role;
    const matrix = User.ROLE_ACCESS_MATRIX;

    if (!matrix || !matrix[role]) {
      return res.status(403).json({ message: "Forbidden: role permissions not found" });
    }

    const userAccess = matrix[role][resource] || "none";

    if (requiredAccess === "full") {
      if (userAccess === "full") {
        return next();
      }
    } else if (requiredAccess === "view") {
      if (userAccess === "view" || userAccess === "full") {
        return next();
      }
    }

    return res.status(403).json({
      message: `Forbidden: role '${role}' does not have '${requiredAccess}' access to '${resource}'`,
    });
  };
};

module.exports = { authorize };
