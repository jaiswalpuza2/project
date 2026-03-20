const express = require("express");
const { getFraudReports } = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Only Admins can access these routes
router.use(protect);
router.use(authorize("admin"));

router.get("/fraud-reports", getFraudReports);

module.exports = router;
