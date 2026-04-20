const mongoose = require("mongoose");
const mentorshipSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please add a title for the mentorship or internship"],
        },
        description: {
            type: String,
            required: [true, "Please add a description"],
        },
        category: {
            type: String, 
            enum: ["Mentorship", "Micro-Internship"],
            default: "Mentorship",
        },
        providerName: {
            type: String,
            required: true,
        },
        skillsCovered: [String],
        duration: {
            type: String,
        },
        link: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("Mentorship", mentorshipSchema);
