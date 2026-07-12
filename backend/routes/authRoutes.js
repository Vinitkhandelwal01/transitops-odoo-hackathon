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

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/reset-password/:token", resetPassword);
router.get("/auth/me", protect, getMe);
router.post("/auth/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;