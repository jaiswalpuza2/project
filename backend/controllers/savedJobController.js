const SavedJob = require("../models/SavedJob");

// @desc    Bookmark a job
// @route   POST /api/saved-jobs/:jobId
// @access  Private (Freelancer)
exports.saveJob = async (req, res, next) => {
    try {
        await SavedJob.create({
            user: req.user.id,
            job: req.params.jobId,
        });

        res.status(201).json({ success: true, message: "Job saved" });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: "Job already saved" });
        }
        next(err);
    }
};

// @desc    Get my saved jobs
// @route   GET /api/saved-jobs
// @access  Private (Freelancer)
exports.getSavedJobs = async (req, res, next) => {
    try {
        const saved = await SavedJob.find({ user: req.user.id })
            .populate({
                path: "job",
                populate: { path: "employer", select: "name companyLogo" }
            });

        res.status(200).json({ success: true, data: saved });
    } catch (err) {
        next(err);
    }
};

// @desc    Remove saved job
// @route   DELETE /api/saved-jobs/:id
// @access  Private (Freelancer)
exports.unsaveJob = async (req, res, next) => {
    try {
        const saved = await SavedJob.findById(req.params.id);
        if (!saved || saved.user.toString() !== req.user.id) {
            return res.status(404).json({ success: false, message: "Not found" });
        }

        await saved.deleteOne();
        res.status(200).json({ success: true, message: "Job removed from saved" });
    } catch (err) {
        next(err);
    }
};
