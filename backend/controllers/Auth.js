const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
 
// ---------- Helper: generate JWT ----------
const generateToken = (user, rememberMe) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: rememberMe ? "30d" : "1d" }
  );
};
 
// ==========================================================
// @route   POST /api/auth/register
// @desc    Register a new user
// ==========================================================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
 
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
 
    if (!User.ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }
 
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }
 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
 
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
 
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error during registration" });
  }
};
 
// ==========================================================
// @route   POST /api/auth/login
// @desc    Login user with 5-attempt lockout logic
// ==========================================================
exports.login = async (req, res) => {
  try {
    const { email, password, role, remember } = req.body; // frontend sends "remember", not "rememberMe"
 
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
 
    // password hidden by default (select: false) -> explicitly select it
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
 
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
 
    if (user.status === "Inactive") {
      return res.status(403).json({ message: "Account is inactive. Contact admin." });
    }
 
    // ---- Check lock status (auto-unlock if lock period expired) ----
    if (user.isLocked) {
      if (user.lockedUntil && user.lockedUntil < new Date()) {
        user.isLocked = false;
        user.lockedUntil = null;
        user.failedLoginAttempts = 0;
        await user.save();
      } else {
        return res.status(423).json({
          message: "Account locked due to too many failed attempts. Try again later.",
          lockedUntil: user.lockedUntil,
        });
      }
    }
 
    // ---- Compare password ----
    const isMatch = await bcrypt.compare(password, user.password);
 
    if (!isMatch) {
      user.failedLoginAttempts += 1;
 
      if (user.failedLoginAttempts >= User.MAX_FAILED_ATTEMPTS) {
        user.isLocked = true;
        user.lockedUntil = new Date(Date.now() + User.LOCK_TIME_MS);
        await user.save();
        return res.status(423).json({
          message: "Account locked due to too many failed attempts.",
          lockedUntil: user.lockedUntil,
        });
      }
 
      await user.save();
      return res.status(401).json({
        message: "Invalid credentials",
        attemptsRemaining: User.MAX_FAILED_ATTEMPTS - user.failedLoginAttempts,
      });
    }
 
    // ---- Optional: validate selected role matches account role ----
    if (role && role !== user.role) {
      return res.status(403).json({ message: `This account is not registered as ${role}` });
    }
 
    // ---- Success: reset attempts, update lastLogin ----
    user.failedLoginAttempts = 0;
    user.isLocked = false;
    user.lockedUntil = null;
    user.lastLogin = new Date();
    user.rememberMe = !!remember;
    await user.save();
 
    const token = generateToken(user, remember);
 
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessMatrix: User.ROLE_ACCESS_MATRIX[user.role],
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};
 
// ==========================================================
// @route   POST /api/auth/forgot-password
// @desc    Generate reset token (email sending left as TODO)
// ==========================================================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
 
    // Don't reveal whether the email exists
    if (!user) {
      return res.status(200).json({
        message: "If that email exists, a reset link has been sent.",
      });
    }
 
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();
 
    // TODO: send resetToken via email service
    return res.status(200).json({
      message: "If that email exists, a reset link has been sent.",
      resetToken, // remove this in production; useful for hackathon testing
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
 
// ==========================================================
// @route   POST /api/auth/reset-password/:token
// @desc    Reset password using token
// ==========================================================
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
 
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
 
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+password");
 
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }
 
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.failedLoginAttempts = 0;
    user.isLocked = false;
    user.lockedUntil = null;
    await user.save();
 
    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
 
// ==========================================================
// @route   GET /api/auth/me
// @desc    Get logged-in user's profile (used to hydrate frontend on refresh)
// ==========================================================
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
 
    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessMatrix: User.ROLE_ACCESS_MATRIX[user.role],
    });
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};