const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.ObjectId,
            ref: "Job",
            required: true,
        },
        employer: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        freelancer: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "escrowed", "released", "refunded"],
            default: "pending",
        },
        transactionId: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Payment", paymentSchema);
