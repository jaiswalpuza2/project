const User = require("../models/User");
const Application = require("../models/Application");
const Job = require("../models/Job");
const Payment = require("../models/Payment");
exports.getPlatformStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeJobs = await Job.countDocuments({ status: "open" });
        const payments = await Payment.aggregate([
            { $match: { status: { $in: ["escrowed", "released"] } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalRevenue = payments.length > 0 ? payments[0].total : 0;
        const completedProjectsCount = await Payment.countDocuments({ status: "released" });
        const highVolumeApplicants = await Application.aggregate([
            { $group: { _id: "$freelancer", count: { $sum: 1 } } },
            { $match: { count: { $gt: 5 } } }
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                activeJobs,
                totalRevenue,
                completedProjects: completedProjectsCount,
                fraudCount: highVolumeApplicants.length
            }
        });
    } catch (err) {
        next(err);
    }
};
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
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password").sort("-createdAt");
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        next(err);
    }
};
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user._id.toString() === req.user.id.toString()) {
            return res.status(400).json({ success: false, message: "You cannot delete yourself" });
        }
        await user.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
exports.getAllJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find().populate("employer", "name email").sort("-createdAt");
        res.status(200).json({ success: true, count: jobs.length, data: jobs });
    } catch (err) {
        next(err);
    }
};
exports.deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }
        await job.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
exports.getChartStats = async (req, res, next) => {
    try {
        const { period = 'monthly' } = req.query; 
        const getMonthlyStats = async (Model, dateField = "createdAt", sumField = null) => {
            const group = {
                _id: {
                    year: { $year: `$${dateField}` },
                    month: { $month: `$${dateField}` }
                },
                count: { $sum: 1 }
            };
            if (sumField) {
                group.total = { $sum: `$${sumField}` };
            }
            return await Model.aggregate([
                { $group: group },
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ]);
        };
        const userGrowth = await getMonthlyStats(User);
        const jobGrowth = await getMonthlyStats(Job);
        const revenueGrowth = await getMonthlyStats(Payment, "createdAt", "amount");
        const completedProjects = await Payment.aggregate([
            { $match: { status: "released" } },
            { $group: {
                _id: {
                    year: { $year: "$updatedAt" },
                    month: { $month: "$updatedAt" }
                },
                count: { $sum: 1 }
            }},
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const chartData = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const m = d.getMonth() + 1;
            const y = d.getFullYear();
            const userData = userGrowth.find(u => u._id.month === m && u._id.year === y);
            const jobData = jobGrowth.find(j => j._id.month === m && j._id.year === y);
            const revData = revenueGrowth.find(r => r._id.month === m && r._id.year === y);
            const compData = completedProjects.find(c => c._id.month === m && c._id.year === y);
            chartData.push({
                name: months[d.getMonth()],
                users: userData ? userData.count : 0,
                jobs: jobData ? jobData.count : 0,
                revenue: revData ? revData.total : 0,
                completed: compData ? compData.count : 0
            });
        }
        res.status(200).json({
            success: true,
            data: chartData
        });
    } catch (err) {
        next(err);
    }
};
exports.toggleUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user._id.toString() === req.user.id.toString()) {
            return res.status(400).json({ success: false, message: "You cannot deactivate yourself" });
        }
        user.isDeactivated = !user.isDeactivated;
        await user.save();
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};
