const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Please add content"],
    },
    excerpt: {
      type: String,
      required: [true, "Please add an excerpt"],
    },
    author: {
      type: String,
      required: [true, "Please add an author"],
      default: "JobSphere Admin",
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      default: "Uncategorized",
    },
    image: {
      type: String,
      required: [true, "Please add an image URL"],
      default: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", blogSchema);
