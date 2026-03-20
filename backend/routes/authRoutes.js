const express = require("express");
const { register, login, getMe, updateProfile, getUserProfile, getTalent, verifyOTP, resendOTP } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", protect, verifyOTP);
router.post("/resend-otp", protect, resendOTP);
router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);

router.get("/profile/:id", getUserProfile);
router.get("/talent", protect, getTalent);

module.exports = router;
