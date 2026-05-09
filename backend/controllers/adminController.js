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

        const getStats = async (Model, dateField = "createdAt", sumField = null, matchStage = null) => {
            let groupId = {};
            if (period === 'yearly') {
                groupId = { year: { $year: `$${dateField}` } };
            } else if (period === 'weekly') {
                groupId = { 
                    year: { $isoWeekYear: `$${dateField}` }, 
                    week: { $isoWeek: `$${dateField}` } 
                };
            } else {
                groupId = { 
                    year: { $year: `$${dateField}` }, 
                    month: { $month: `$${dateField}` } 
                };
            }

            const group = {
                _id: groupId,
                count: { $sum: 1 }
            };
            
            if (sumField) group.total = { $sum: `$${sumField}` };

            const pipeline = [];
            if (matchStage) pipeline.push({ $match: matchStage });
            pipeline.push({ $group: group });
            return await Model.aggregate(pipeline);
        };

        const userGrowth = await getStats(User);
        const jobGrowth = await getStats(Job);
        const revenueGrowth = await getStats(Payment, "createdAt", "amount");
        const completedProjects = await getStats(Payment, "updatedAt", null, { status: "released" });

        const chartData = [];
        const now = new Date();

        if (period === 'yearly') {
            for (let i = 4; i >= 0; i--) {
                const y = now.getFullYear() - i;
                const userData = userGrowth.find(u => u._id.year === y);
                const jobData = jobGrowth.find(j => j._id.year === y);
                const revData = revenueGrowth.find(r => r._id.year === y);
                const compData = completedProjects.find(c => c._id.year === y);
                
                chartData.push({
                    name: y.toString(),
                    users: userData ? userData.count : 0,
                    jobs: jobData ? jobData.count : 0,
                    revenue: revData ? revData.total : 0,
                    completed: compData ? compData.count : 0
                });
            }
        } else if (period === 'weekly') {
            const getWeekNumber = (d) => {
                const date = new Date(d.getTime());
                date.setHours(0, 0, 0, 0);
                date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
                const week1 = new Date(date.getFullYear(), 0, 4);
                return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
            };

            for (let i = 7; i >= 0; i--) {
                const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
                const w = getWeekNumber(d);
                const y = new Date(d.getTime() + 3 * 24 * 60 * 60 * 1000).getFullYear();

                const userData = userGrowth.find(u => u._id.week === w && u._id.year === y);
                const jobData = jobGrowth.find(j => j._id.week === w && j._id.year === y);
                const revData = revenueGrowth.find(r => r._id.week === w && r._id.year === y);
                const compData = completedProjects.find(c => c._id.week === w && c._id.year === y);
                
                chartData.push({
                    name: `W${w}`,
                    users: userData ? userData.count : 0,
                    jobs: jobData ? jobData.count : 0,
                    revenue: revData ? revData.total : 0,
                    completed: compData ? compData.count : 0
                });
            }
        } else {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
