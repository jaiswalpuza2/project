const express = require("express");
const { generateResume, generateProposal, chatbot, recommendMentorship, exportResumePDF, getAIStatus } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/status", getAIStatus);
router.post("/generate-resume", protect, generateResume);
router.post("/generate-proposal", protect, generateProposal);
router.post("/chatbot", chatbot);
router.post("/recommend-mentorship", protect, recommendMentorship);
router.post("/export-pdf", protect, exportResumePDF);

module.exports = router;
