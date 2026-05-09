const express = require("express");
const router = express.Router();
const { getBlogs, getBlog, createBlog, deleteBlog, subscribe } = require("../controllers/blogController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/")
  .get(getBlogs)
  .post(protect, authorize("admin"), createBlog);

router.post("/subscribe", subscribe);

router.route("/:id")
  .get(getBlog)
  .delete(protect, authorize("admin"), deleteBlog);


module.exports = router;
