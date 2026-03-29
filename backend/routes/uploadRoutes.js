const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
router.post("/resume", protect, upload.single("resume"), (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error("Please upload a file");
    }
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/resumes/${req.file.filename}`;
    res.status(200).json({
        success: true,
        data: fileUrl,
    });
});
router.post("/profile-image", protect, upload.single("profileImage"), (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error("Please upload an image");
    }
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/images/${req.file.filename}`;
    res.status(200).json({
        success: true,
        data: fileUrl,
    });
});
router.post("/chat-attachment", protect, upload.single("chatAttachment"), (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error("Please upload a file");
    }
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/attachments/${req.file.filename}`;
    res.status(200).json({
        success: true,
        data: fileUrl,
    });
});
module.exports = router;
