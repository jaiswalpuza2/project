const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Blog = require("./models/Blog");

dotenv.config();

const checkBlog = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    const id = "69c8ce2e01f4013dc582cc17";
    const blog = await Blog.findById(id);
    if (blog) {
      console.log("Blog found:", blog.title);
    } else {
      console.log("Blog NOT found in DB");
      const allBlogs = await Blog.find();
      console.log("Existing IDs:", allBlogs.map(b => b._id.toString()));
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkBlog();
