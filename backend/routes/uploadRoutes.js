const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

// @desc    Upload resume
// @route   POST /api/upload/resume
// @access  Private
router.post("/resume", protect, upload.single("resume"), (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error("Please upload a file");
    }

    // Construct URL
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/resumes/${req.file.filename}`;

    res.status(200).json({
        success: true,
        data: fileUrl,
    });
});

module.exports = router;
