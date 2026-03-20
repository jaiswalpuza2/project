const Message = require("../models/Message");

// @desc    Get chat history between two users
// @route   GET /api/chat/:userId
// @access  Private
exports.getChatHistory = async (req, res, next) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, recipient: req.params.userId },
                { sender: req.params.userId, recipient: req.user.id },
            ],
        }).sort("createdAt");

        res.status(200).json({
            success: true,
            data: messages,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all messaging contacts (people user chatted with)
// @route   GET /api/chat/contacts
// @access  Private
exports.getContacts = async (req, res, next) => {
    try {
        const messages = await Message.find({
            $or: [{ sender: req.user.id }, { recipient: req.user.id }],
        })
            .sort("-createdAt")
            .populate("sender", "name role profileImage")
            .populate("recipient", "name role profileImage");

        const contactsMap = new Map();

        messages.forEach((msg) => {
            const otherUser = msg.sender._id.toString() === req.user.id ? msg.recipient : msg.sender;

            if (otherUser && !contactsMap.has(otherUser._id.toString())) {
                contactsMap.set(otherUser._id.toString(), otherUser);
            }
        });

        res.status(200).json({
            success: true,
            data: Array.from(contactsMap.values()),
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Save message to DB
exports.saveMessage = async (data) => {
    try {
        const message = await Message.create({
            sender: data.senderId,
            recipient: data.recipientId,
            content: data.content,
            job: data.jobId,
        });
        return message;
    } catch (err) {
        console.error("Error saving message:", err);
        return null;
    }
};
