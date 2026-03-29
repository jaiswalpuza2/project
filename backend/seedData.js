const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Mentorship = require("./models/Mentorship");
const Job = require("./models/Job");
const User = require("./models/User");

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        const employer = await User.findOne({ role: "employer" });
        if (!employer) {
            console.error("No employer found in database. Please register an employer first.");
            process.exit(1);
        }

        const mentorships = [
            {
                title: "Advanced React Patterns",
                description: "Master HOCs, Render Props, and Custom Hooks with a Senior Architect.",
                category: "Mentorship",
                providerName: "Meta Engineers Guild",
                skillsCovered: ["React", "JavaScript", "Architecture"],
                duration: "4 Weeks",
                link: "https://example.com/react-mentorship"
            },
            {
                title: "Node.js Performance Tuning",
                description: "Learn how to profile and optimize high-traffic Express applications.",
                category: "Mentorship",
                providerName: "Performance Labs",
                skillsCovered: ["Node.js", "Express", "Optimization"],
                duration: "3 Weeks",
                link: "https://example.com/node-performance"
            },
            {
                title: "UI/UX Design for SaaS",
                description: "Practical internship focused on building dashboards and design systems.",
                category: "Micro-Internship",
                providerName: "DesignFlow Agency",
                skillsCovered: ["Figma", "UI/UX", "Product Design"],
                duration: "2 Weeks",
                link: "https://example.com/ux-internship"
            },
            {
                title: "Python for Data Science",
                description: "Quick start into Pandas, Matplotlib, and Scikit-learn.",
                category: "Micro-Internship",
                providerName: "DataCrunch Co.",
                skillsCovered: ["Python", "Data Science", "Machine Learning"],
                duration: "10 Days",
                link: "https://example.com/python-data"
            }
        ];

        await Mentorship.deleteMany({});
        await Mentorship.insertMany(mentorships);
        console.log("Mentorships seeded!");

        const jobs = [
            {
                title: "Senior React Developer",
                description: "We are looking for a React expert to help us build a modern SaaS platform.",
                employer: employer._id,
                budget: 5000 / 133, // Around $37.5
                skillsRequired: ["React", "Tailwind CSS", "Node.js"],
                category: "Web Development",
                jobType: "Fixed",
                experienceLevel: "Expert"
            },
            {
                title: "Python Backend Engineer",
                description: "Build scalable APIs using FastAPI and PostgreSQL.",
                employer: employer._id,
                budget: 8000 / 133,
                skillsRequired: ["Python", "FastAPI", "SQL"],
                category: "Web Development",
                jobType: "Hourly",
                experienceLevel: "Intermediate"
            },
            {
                title: "Mobile App UI Designer",
                description: "Design beautiful interfaces for our upcoming iOS/Android app.",
                employer: employer._id,
                budget: 4000 / 133,
                skillsRequired: ["Figma", "UI/UX"],
                category: "UI/UX Design",
                jobType: "Fixed",
                experienceLevel: "Intermediate"
            }
        ];

        const jobCount = await Job.countDocuments();
        if (jobCount < 5) {
            await Job.insertMany(jobs);
            console.log("Sample jobs seeded!");
        }

        console.log("Seeding complete!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
