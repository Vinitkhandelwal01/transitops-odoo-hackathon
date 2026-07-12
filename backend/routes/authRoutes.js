const express = require("express");
const router = express.Router();

const {
  login,
  register,
  forgotPassword,
  resetPassword,
  getMe,
} = require("../controllers/Auth");
const { protect } = require("../middleware/Auth");

// NOTE: mounted at /api/auth in routes/index.js, so paths here must NOT repeat "/auth"
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", protect, getMe);
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
