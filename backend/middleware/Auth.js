const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================================
// protect: verifies JWT, attaches decoded user to req.user
// Use on any route that requires the user to be logged in
// ==========================================================
exports.protect = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional but recommended: confirm user still exists & is active
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }
    if (user.status === "Inactive") {
      return res.status(403).json({ message: "Account is inactive" });
    }

    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired, please log in again" });
    }
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

// ==========================================================
// authorize: restricts route to specific roles
// Usage: router.get("/fleet", protect, authorize("Fleet Manager"), handler)
// Usage (multiple roles): authorize("Fleet Manager", "Dispatcher")
// ==========================================================
exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Role '${req.user.role}' cannot perform this action.`,
      });
    }

    next();
  };
};

// ==========================================================
// checkModuleAccess: checks against ROLE_ACCESS_MATRIX
// Usage: checkModuleAccess("fleet", "full")  -> requires full (write) access
// Usage: checkModuleAccess("fleet", "view")  -> allows both "view" and "full"
// ==========================================================
exports.checkModuleAccess = (module, requiredLevel = "view") => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const access = User.ROLE_ACCESS_MATRIX[req.user.role]?.[module] || "none";

    if (access === "none") {
      return res.status(403).json({ message: `You don't have access to ${module}` });
    }

    if (requiredLevel === "full" && access !== "full") {
      return res.status(403).json({ message: `You only have view access to ${module}` });
    }

    next();
  };
};