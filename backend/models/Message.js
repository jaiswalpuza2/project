const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        recipient: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: function() { return this.type === 'text'; },
        },
        type: {
            type: String,
            enum: ["text", "image", "file", "location"],
            default: "text",
        },
        fileUrl: {
            type: String,
        },
        location: {
            lat: Number,
            lng: Number,
            address: String,
        },
        job: {
            type: mongoose.Schema.ObjectId,
            ref: "Job",
        },
        replyTo: {
            type: mongoose.Schema.ObjectId,
            ref: "Message",
        },
        reactions: [
            {
                emoji: String,
                user: {
                    type: mongoose.Schema.ObjectId,
                    ref: "User",
                },
            },
        ],
        isEdited: {
            type: Boolean,
            default: false,
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Message", messageSchema);
