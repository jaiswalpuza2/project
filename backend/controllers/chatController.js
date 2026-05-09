const Message = require("../models/Message");
const Notification = require("../models/Notification");
exports.getChatHistory = async (req, res, next) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, recipient: req.params.userId },
                { sender: req.params.userId, recipient: req.user.id },
            ],
        })
        .populate("replyTo", "content sender")
        .sort("createdAt");
        res.status(200).json({
            success: true,
            data: messages,
        });
    } catch (err) {
        next(err);
    }
};
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
exports.deleteMessage = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            res.status(404);
            throw new Error("Message not found");
        }
        if (message.sender.toString() !== req.user.id) {
            res.status(401);
            throw new Error("Not authorized to delete this message");
        }
        const recipientId = message.recipient;
        await Message.deleteOne({ _id: req.params.id });
        res.status(200).json({
            success: true,
            data: {},
            recipientId: recipientId 
        });
    } catch (err) {
        next(err);
    }
};
exports.editMessage = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            res.status(404);
            throw new Error("Message not found");
        }
        if (message.sender.toString() !== req.user.id) {
            res.status(401);
            throw new Error("Not authorized to edit this message");
        }
        if (message.type !== "text") {
            res.status(400);
            throw new Error("Only text messages can be edited");
        }
        message.content = req.body.content;
        message.isEdited = true;
        await message.save();
        res.status(200).json({
            success: true,
            data: message,
            recipientId: message.recipient
        });
    } catch (err) {
        next(err);
    }
};
exports.addReaction = async (req, res, next) => {
    try {
        const { emoji } = req.body;
        const message = await Message.findById(req.params.id);
        if (!message) {
            res.status(404);
            throw new Error("Message not found");
        }
        const existingReactionIndex = message.reactions.findIndex(
            (r) => r.user.toString() === req.user.id && r.emoji === emoji
        );
        if (existingReactionIndex > -1) {
            message.reactions.splice(existingReactionIndex, 1);
        } else {
            message.reactions.push({ emoji, user: req.user.id });
        }
        await message.save();
        res.status(200).json({
            success: true,
            data: message.reactions,
            recipientId: message.sender.toString() === req.user.id ? message.recipient : message.sender
        });
    } catch (err) {
        next(err);
    }
};
exports.togglePinMessage = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            res.status(404);
            throw new Error("Message not found");
        }
        if (message.sender.toString() !== req.user.id && message.recipient.toString() !== req.user.id) {
            res.status(401);
            throw new Error("Not authorized to pin this message");
        }
        message.isPinned = !message.isPinned;
        await message.save();
        res.status(200).json({
            success: true,
            data: message,
            recipientId: message.sender.toString() === req.user.id ? message.recipient : message.sender
        });
    } catch (err) {
        next(err);
    }
};
exports.clearChat = async (req, res, next) => {
    try {
        await Message.deleteMany({
            $or: [
                { sender: req.user.id, recipient: req.params.userId },
                { sender: req.params.userId, recipient: req.user.id },
            ],
        });
        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        next(err);
    }
};
exports.saveMessage = async (data) => {
    try {
        const message = await Message.create({
            sender: data.senderId,
            recipient: data.recipientId,
            content: data.content,
            type: data.type || "text",
            fileUrl: data.fileUrl,
            location: data.location,
            job: data.jobId,
            replyTo: data.replyTo,
        });
        if (data.replyTo) {
            await message.populate("replyTo", "content sender");
        }
        await Notification.create({
            recipient: data.recipientId,
            message: `New message from ${data.senderName || "someone"}: ${data.content.substring(0, 50)}${data.content.length > 50 ? "..." : ""}`,
            type: "message",
            relatedId: message._id,
        });
        return message;
    } catch (err) {
        console.error("Error saving message:", err);
    }
};
exports.toggleMuteUser = async (req, res, next) => {
    try {
        const User = require("../models/User");
        console.log(`Mute Toggle Request - Auth User: ${req.user?._id || req.user?.id}, Target: ${req.params.userId}`);
        const user = await User.findById(req.user.id);
        const targetUserId = req.params.userId;
        if (!user) {
            console.error("Mute Toggle: User not found in DB");
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (!user.mutedUsers) {
            user.mutedUsers = [];
        }
        const isMuted = user.mutedUsers.some(id => id.toString() === targetUserId);
        console.log(`Current Mute Status for ${targetUserId}: ${isMuted}`);
        if (isMuted) {
            user.mutedUsers = user.mutedUsers.filter(id => id.toString() !== targetUserId);
        } else {
            user.mutedUsers.push(targetUserId);
        }
        await user.save();
        console.log(`Updated Muted List: ${user.mutedUsers}`);
        res.status(200).json({
            success: true,
            isMuted: !isMuted,
        });
    } catch (err) {
        console.error("CRITICAL Mute Toggle Error:", err);
        next(err);
    }
};
exports.getChatMedia = async (req, res, next) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, recipient: req.params.userId },
                { sender: req.params.userId, recipient: req.user.id },
            ],
            type: { $in: ["image", "file", "location"] }
        }).sort("-createdAt");
        const textMessages = await Message.find({
            $or: [
                { sender: req.user.id, recipient: req.params.userId },
                { sender: req.params.userId, recipient: req.user.id },
            ],
            type: "text",
            content: { $regex: /https?:\/\/[^\s]+/ }
        });
        const links = [];
        textMessages.forEach(msg => {
            const matches = msg.content.match(/https?:\/\/[^\s]+/g);
            if (matches) {
                matches.forEach(url => links.push({ url, createdAt: msg.createdAt }));
            }
        });
        res.status(200).json({
            success: true,
            data: {
                media: messages.filter(m => m.type === "image"),
                docs: messages.filter(m => m.type === "file"),
                links: links,
            }
        });
    } catch (err) {
        next(err);
    }
};
