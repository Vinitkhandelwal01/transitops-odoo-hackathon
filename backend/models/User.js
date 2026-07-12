const mongoose = require("mongoose");

const USER_ROLES = ["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // hashing/comparison done in controller; kept hidden by default
    },
    role: {
      type: String,
      enum: USER_ROLES,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    // --- Account lockout (5 failed attempts -> lock) ---
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    lockedUntil: {
      type: Date,
      default: null,
    },

    // --- Misc ---
    lastLogin: {
      type: Date,
      default: null,
    },
    rememberMe: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// ---------- Role-based module access map (for RBAC / Settings page) ----------
// "full" = create/edit, "view" = read-only, "none" = no access
userSchema.statics.ROLE_ACCESS_MATRIX = {
  "Fleet Manager": { fleet: "full", drivers: "full", trips: "none", fuelExpenses: "none", analytics: "full" },
  Dispatcher: { fleet: "view", drivers: "none", trips: "full", fuelExpenses: "none", analytics: "none" },
  "Safety Officer": { fleet: "none", drivers: "full", trips: "view", fuelExpenses: "none", analytics: "none" },
  "Financial Analyst": { fleet: "view", drivers: "none", trips: "none", fuelExpenses: "full", analytics: "full" },
};

userSchema.statics.ROLES = USER_ROLES;
userSchema.statics.MAX_FAILED_ATTEMPTS = 5;
userSchema.statics.LOCK_TIME_MS = 15 * 60 * 1000; // 15 min, adjust as needed

module.exports = mongoose.model("User", userSchema);