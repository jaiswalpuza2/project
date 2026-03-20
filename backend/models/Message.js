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
            required: [true, "Please add message content"],
        },
        job: {
            type: mongoose.Schema.ObjectId,
            ref: "Job",
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
