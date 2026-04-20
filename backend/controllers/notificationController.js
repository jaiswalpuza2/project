const Notification = require("../models/Notification");
exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort("-createdAt")
            .limit(50); 
        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications,
        });
    } catch (err) {
        next(err);
    }
};
exports.markAsRead = async (req, res, next) => {
    try {
        let notification = await Notification.findById(req.params.id);
        if (!notification) {
            res.status(404);
            throw new Error(`Notification not found with id of ${req.params.id}`);
        }
        if (notification.recipient.toString() !== req.user.id) {
            res.status(401);
            throw new Error(`Not authorized to update this notification`);
        }
        notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            {
                new: true,
                runValidators: true,
            }
        );
        res.status(200).json({
            success: true,
            data: notification,
        });
    } catch (err) {
        next(err);
    }
};
exports.markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, isRead: false },
            { $set: { isRead: true } }
        );
        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        next(err);
    }
};
