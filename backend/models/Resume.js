const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      required: [true, "Please add a full name"],
    },
    targetRole: {
      type: String,
      required: [true, "Please add a target job role"],
    },
    summary: {
      type: String,
    },
    experience: [
      {
        company: String,
        role: String,
        period: String,
        desc: String,
      },
    ],
    skills: [String],
    education: [
      {
        school: String,
        degree: String,
        period: String,
      },
    ],
    projects: [
      {
        name: String,
        description: String,
        link: String,
      },
    ],
    isAIOptimized: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);
