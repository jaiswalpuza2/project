const User = require("../models/User");
const Application = require("../models/Application");

// @desc    Get suspicious / fraudulent activity
// @route   GET /api/admin/fraud-reports
// @access  Private/Admin
exports.getFraudReports = async (req, res, next) => {
    try {
        const suspiciousActivity = [];

      
        const highVolumeApplicants = await Application.aggregate([
            { $group: { _id: "$freelancer", count: { $sum: 1 } } },
            { $match: { count: { $gt: 5 } } }
        ]);

        for (const record of highVolumeApplicants) {
            const user = await User.findById(record._id).select("name email");
            if (user) {
                suspiciousActivity.push({
                    type: "High Application Volume",
                    user: user.name,
                    email: user.email,
                    details: `Submitted ${record.count} applications. Possible spam.`,
                    timestamp: new Date()
                });
            }
        }

     

        res.status(200).json({
            success: true,
            data: suspiciousActivity
        });
    } catch (err) {
        next(err);
    }
};
