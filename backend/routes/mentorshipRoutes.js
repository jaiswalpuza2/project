const express = require("express");
const { getMentorships, createMentorship } = require("../controllers/mentorshipController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getMentorships);
router.post("/", protect, authorize("admin"), createMentorship);

module.exports = router;
