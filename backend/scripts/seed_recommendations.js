const mongoose = require("mongoose");
const Job = require("../models/Job");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const seedRecommendations = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        let employer = await User.findOne({ role: "employer" });
        if (!employer) {
            console.log("No employer found. Creating mock employer...");
            employer = await User.create({
                name: "Tech Solutions Inc.",
                email: "employer@techsolutions.com",
                password: "password123", 
                role: "employer",
                isVerified: true,
                isProfileComplete: true,
                companyDescription: "Leading tech company specializing in AI and Web Development."
            });
        }

        const mockJobs = [
            {
                title: "Mock Job: Senior React Developer",
                description: "We are looking for a Senior React Developer to build high-performance web applications. Experience with Redux and Tailwind CSS is a must.",
                employer: employer._id,
                budget: 5000,
                skillsRequired: ["React", "JavaScript", "Tailwind CSS", "Redux"],
                category: "Web Development",
                jobType: "Remote",
                experienceLevel: "Expert",
                status: "open"
            },
            {
                title: "Mock Job: Fullstack Node.js Engineer",
                description: "Join our team to build scalable backend services using Node.js and Express. Experience with MongoDB is required.",
                employer: employer._id,
                budget: 4500,
                skillsRequired: ["Node.js", "Express", "MongoDB", "JavaScript"],
                category: "Web Development",
                jobType: "Fixed",
                experienceLevel: "Intermediate",
                status: "open"
            },
            {
                title: "Mock Job: Python Data Scientist",
                description: "Looking for a Data Scientist to analyze complex datasets and build machine learning models using Python and Scikit-learn.",
                employer: employer._id,
                budget: 6000,
                skillsRequired: ["Python", "Machine Learning", "Data Analysis", "SQL"],
                category: "Data Science",
                jobType: "Remote",
                experienceLevel: "Expert",
                status: "open"
            },
            {
                title: "Mock Job: UI/UX Designer for Mobile App",
                description: "Design intuitive and beautiful user interfaces for our upcoming iOS and Android apps using Figma.",
                employer: employer._id,
                budget: 3500,
                skillsRequired: ["Figma", "UI Design", "UX Research", "Mobile App Design"],
                category: "UI/UX Design",
                jobType: "Hourly",
                experienceLevel: "Intermediate",
                status: "open"
            },
            {
                title: "Mock Job: Content Writer for Tech Blog",
                description: "Write engaging articles and blog posts about the latest trends in technology and software development.",
                employer: employer._id,
                budget: 1500,
                skillsRequired: ["Content Writing", "Copywriting", "SEO", "Technical Writing"],
                category: "Content Writing",
                jobType: "Remote",
                experienceLevel: "Entry",
                status: "open"
            }
        ];

        console.log("Seeding mock jobs...");
        await Job.insertMany(mockJobs);
        console.log("Mock jobs seeded successfully!");

        process.exit();
    } catch (err) {
        console.error("Error seeding data:", err);
        process.exit(1);
    }
};

seedRecommendations();
