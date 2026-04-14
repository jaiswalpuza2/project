const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Blog = require("./models/Blog");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const blogs = [
  {
    title: "How to land your first high-paying freelance gig in Nepal",
    excerpt: "The ultimate guide to building a profile that stands out and attracts global clients while working from Nepal.",
    content: "Freelancing in Nepal is growing rapidly. To succeed, you need a strong portfolio, clear communication, and a focus on niche skills like React, Node.js, or AI integration...",
    author: "Puja Chaudhary",
    category: "Freelacing Tips",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Top 10 skills in demand for 2026: What employers want",
    excerpt: "From AI integration to specialized development, discover which skills are commanding the highest rates this year.",
    content: "As we move into 2026, AI literacy is no longer optional. Employers are looking for developers who can leverage LLMs, build agentic workflows, and maintain robust full-stack architectures...",
    author: "JobSphere Editorial",
    category: "Market Trends",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
  }
];

const seedBlogs = async () => {
  try {
    await Blog.deleteMany();
    await Blog.insertMany(blogs);
    console.log("Blog data seeded successfully! 🚀");
    process.exit();
  } catch (err) {
    console.error("Error seeding blogs:", err);
    process.exit(1);
  }
};

seedBlogs();
