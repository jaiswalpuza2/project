const express = require("express");
const router = express.Router();
const { getBlogs, createBlog, deleteBlog } = require("../controllers/blogController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/")
  .get(getBlogs)
  .post(protect, authorize("admin"), createBlog);

router.route("/:id")
  .delete(protect, authorize("admin"), deleteBlog);

module.exports = router;
