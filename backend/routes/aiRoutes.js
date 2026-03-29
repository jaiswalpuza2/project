const express = require("express");
const { 
    generateResume, 
    optimizeResume,
    generateProposal, 
    chatbot, 
    recommendMentorship, 
    exportResumePDF, 
    getAIStatus,
    saveResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume
} = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
router.get("/status", getAIStatus);
router.post("/generate-resume", protect, generateResume);
router.post("/optimize-resume", protect, optimizeResume);
router.post("/generate-proposal", protect, generateProposal);
router.post("/chatbot", chatbot);
router.post("/recommend-mentorship", protect, recommendMentorship);
router.post("/export-pdf", protect, exportResumePDF);
router.post("/resumes", protect, saveResume);
router.get("/resumes", protect, getUserResumes);
router.get("/resumes/:id", protect, getResumeById);
router.put("/resumes/:id", protect, updateResume);
router.delete("/resumes/:id", protect, deleteResume);
module.exports = router;
