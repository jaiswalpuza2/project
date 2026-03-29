const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");
exports.getAnalytics = async (req, res, next) => {
    try {
        let stats = {};
        if (req.user.role === "employer") {
            const totalJobs = await Job.countDocuments({ employer: req.user.id });
            const totalApplicants = await Application.countDocuments({
                job: { $in: await Job.find({ employer: req.user.id }).distinct("_id") }
            });
            const recentApps = await Application.find({
                job: { $in: await Job.find({ employer: req.user.id }).distinct("_id") }
            }).limit(5).populate("freelancer", "name").populate("job", "title");
            stats = { totalJobs, totalApplicants, recentApps };
        } else if (req.user.role === "freelancer") {
            const applicationsSent = await Application.countDocuments({ freelancer: req.user.id });
            const acceptedApps = await Application.countDocuments({ freelancer: req.user.id, status: "interview" });
            stats = { applicationsSent, acceptedApps };
        }
        res.status(200).json({ success: true, data: stats });
    } catch (err) {
        next(err);
    }
};
