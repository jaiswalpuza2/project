const mongoose = require("mongoose");
const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.ObjectId,
      ref: "Job",
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    proposal: {
      type: String,
      required: [true, "Please add a proposal"],
    },
    resumeUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "shortlisted", "rejected", "accepted"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
applicationSchema.index({ job: 1, freelancer: 1 }, { unique: true });
module.exports = mongoose.model("Application", applicationSchema);