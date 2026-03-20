const Application = require("../models/Application");
const Job = require("../models/Job");

// @desc    Apply to a job
// @route   POST /api/applications/apply
// @access  Private (Freelancer)
exports.applyToJob = async (req, res, next) => {
  try {
    req.body.freelancer = req.user.id;

    // Check if job exists
    const job = await Job.findById(req.body.job);
    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }

    // Check if open
    if (job.status !== "open") {
      res.status(400);
      throw new Error("Job is no longer open for applications");
    }

    const application = await Application.create(req.body);

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer)
exports.getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }

    // Make sure user is owner
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

// @desc    Get user's applications
// @route   GET /api/applications/my
// @access  Private (Freelancer)
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

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private (Employer)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    let application = await Application.findById(req.params.id).populate("job");

    if (!application) {
      res.status(404);
      throw new Error("Application not found");
    }

    // Make sure user is the employer of the job
    if (application.job.employer.toString() !== req.user.id && req.user.role !== "admin") {
      res.status(401);
      throw new Error("Not authorized to update this application");
    }

    application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (err) {
    next(err);
  }
};