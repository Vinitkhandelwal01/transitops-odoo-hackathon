const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if account is locked
    if (user.isLocked) {
      const now = new Date();
      if (user.lockedUntil && user.lockedUntil > now) {
        const remainingMinutes = Math.ceil((user.lockedUntil - now) / 60000);
        return res.status(403).json({
          message: `Account is locked. Please try again after ${remainingMinutes} minutes.`,
        });
      } else {
        // Unlock account
        user.isLocked = false;
        user.failedLoginAttempts = 0;
        user.lockedUntil = null;
        await user.save();
      }
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Reset failed attempts
      user.failedLoginAttempts = 0;
      user.lastLogin = new Date();
      await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      // Increment failed attempts
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= User.MAX_FAILED_ATTEMPTS) {
        user.isLocked = true;
        user.lockedUntil = new Date(Date.now() + User.LOCK_TIME_MS);
        await user.save();
        return res.status(403).json({
          message: `Account locked due to ${User.MAX_FAILED_ATTEMPTS} failed attempts. Try again in 15 minutes.`,
        });
      } else {
        await user.save();
        res.status(401).json({
          message: `Invalid email or password. Attempt ${user.failedLoginAttempts} of ${User.MAX_FAILED_ATTEMPTS}.`,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
