const Blog = require("../models/Blog");
const Subscriber = require("../models/Subscriber");

// @desc    Get all blog posts
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort("-createdAt");
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single blog post
// @route   GET /api/blogs/:id
// @access  Public
exports.getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (err) {
    next(err);
  }
};


// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private/Admin
exports.createBlog = async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    await blog.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc    Subscribe to newsletter
// @route   POST /api/blogs/subscribe
// @access  Public
exports.subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(`Newsletter subscription request for: ${email}`);
    if (!email) {
      return res.status(400).json({ success: false, message: "Please provide an email" });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(200).json({ success: true, message: "Already subscribed!" });
    }

    await Subscriber.create({ email });
    console.log(`Successfully subscribed: ${email}`);

    res.status(201).json({
      success: true,
      message: "Subscribed successfully!",
    });
  } catch (err) {
    console.error("Subscription Error:", err.message);
    if (err.code === 11000) {
       return res.status(200).json({ success: true, message: "Already subscribed!" });
    }
    next(err);
  }
};
