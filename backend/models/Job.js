const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a job title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    employer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    budget: {
      type: Number,
      required: [true, "Please add a budget"],
    },
    skillsRequired: {
      type: [String],
      required: [true, "Please add required skills"],
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      enum: ["Web Development", "Mobile Development", "UI/UX Design", "Content Writing", "Data Science", "Other"],
    },
    jobType: {
      type: String,
      required: [true, "Please add a job type"],
      enum: ["Remote", "Fixed", "Hourly"],
      default: "Fixed",
    },
    experienceLevel: {
      type: String,
      required: [true, "Please add an experience level"],
      enum: ["Entry", "Intermediate", "Expert"],
      default: "Intermediate",
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);