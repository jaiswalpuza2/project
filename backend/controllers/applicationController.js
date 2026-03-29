const Application = require("../models/Application");
const Job = require("../models/Job");
const Notification = require("../models/Notification");
exports.applyToJob = async (req, res, next) => {
  try {
    req.body.freelancer = req.user.id;
    const job = await Job.findById(req.body.job);
    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }
    if (job.status !== "open") {
      res.status(400);
      throw new Error("Job is no longer open for applications");
    }
    const application = await Application.create(req.body);
    await Notification.create({
      recipient: job.employer,
      message: `New application received for your job: ${job.title}`,
      type: "application",
      relatedId: application._id,
    });
    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (err) {
    next(err);
  }
};
exports.getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }
    if (job.employer.toString() !== req.user.id && req.user.role !== "admin") {
      res.status(401);
      throw new Error("Not authorized to view applications for this job");
    }
    const applications = await Application.find({ job: req.params.jobId }).populate(
      "freelancer",
      "name email skills bio"
    );
    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (err) {
    next(err);
  }
};
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ freelancer: req.user.id }).populate(
      "job",
      "title employer budget"
    );
    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (err) {
    next(err);
  }
};
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    let application = await Application.findById(req.params.id).populate("job");
    if (!application) {
      res.status(404);
      throw new Error("Application not found");
    }
    if (application.job.employer.toString() !== req.user.id && req.user.role !== "admin") {
      res.status(401);
      throw new Error("Not authorized to update this application");
    }
    application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    await Notification.create({
      recipient: application.freelancer,
      message: `Your application for "${application.job.title}" has been updated to: ${req.body.status}`,
      type: "application",
      relatedId: application._id,
    });
    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (err) {
    next(err);
  }
};