const express = require("express");
const {
  applyToJob,
  getJobApplications,
  getMyApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
router.post("/apply", protect, authorize("freelancer"), applyToJob);
router.get("/job/:jobId", protect, authorize("employer", "admin"), getJobApplications);
router.get("/my", protect, authorize("freelancer"), getMyApplications);
router.put("/:id", protect, authorize("employer", "admin"), updateApplicationStatus);
module.exports = router;