const express = require("express");
const { saveJob, getSavedJobs, unsaveJob } = require("../controllers/savedJobController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorize("freelancer"));

router.route("/").get(getSavedJobs);
router.route("/:jobId").post(saveJob);
router.route("/:id").delete(unsaveJob);

module.exports = router;
