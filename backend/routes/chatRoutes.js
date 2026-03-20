const express = require("express");
const { getChatHistory, getContacts } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/contacts", protect, getContacts);
router.get("/:userId", protect, getChatHistory);

module.exports = router;
