const Mentorship = require("../models/Mentorship");
exports.getMentorships = async (req, res, next) => {
    try {
        let query = {};
        if (req.query.skill) {
            query.skillsCovered = { $regex: req.query.skill, $options: "i" };
        }
        const mentorships = await Mentorship.find(query);
        res.status(200).json({
            success: true,
            data: mentorships,
        });
    } catch (err) {
        next(err);
    }
};
exports.createMentorship = async (req, res, next) => {
    try {
        const mentorship = await Mentorship.create(req.body);
        res.status(201).json({
            success: true,
            data: mentorship,
        });
    } catch (err) {
        next(err);
    }
};
