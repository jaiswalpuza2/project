const express = require("express");
const { 
    getFraudReports, 
    getPlatformStats,
    getAllUsers,
    deleteUser,
    getAllJobs,
    deleteJob,
    getChartStats,
    toggleUserStatus
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");
const router = express.Router();
router.use(protect);
router.use(authorize("admin"));
router.get("/fraud-reports", getFraudReports);
router.get("/stats", getPlatformStats);
router.get("/chart-stats", getChartStats);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/jobs", getAllJobs);
router.delete("/jobs/:id", deleteJob);
router.put("/users/:id/toggle-status", toggleUserStatus);
module.exports = router;
