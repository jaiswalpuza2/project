const express = require("express");
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getRecommendations,
} = require("../controllers/jobController");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
router.route("/recommendations").get(protect, authorize("freelancer", "admin"), getRecommendations);
router
  .route("/")
  .get(getJobs)
  .post(protect, authorize("employer", "admin"), createJob);
router
  .route("/:id")
  .get(getJob)
  .put(protect, authorize("employer", "admin"), updateJob)
  .delete(protect, authorize("employer", "admin"), deleteJob);
module.exports = router;