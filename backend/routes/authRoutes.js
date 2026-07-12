const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../src/middleware/auth.middleware");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/me", protect, authController.getUserProfile);

module.exports = router;
