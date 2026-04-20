const mongoose = require("mongoose");
const Mentorship = require("./models/Mentorship");
require("dotenv").config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Mentorship.countDocuments();
        console.log(`Current Mentorship count: ${count}`);
        if (count === 0) {
            console.log("Seeding sample mentorships...");
            await Mentorship.create([
                {
                    title: "Advanced AI Ethics Workshop",
                    description: "Learn how to build responsible AI systems with industry experts.",
                    category: "Mentorship",
                    providerName: "AI Safety Institute",
                    skillsCovered: ["Advanced AI Ethics", "Machine Learning", "Data Science"],
                    duration: "4 Weeks",
                    link: "https://example.com/ai-ethics"
                },
                {
                    title: "Chaos Engineering 101",
                    description: "Practical guide to Gremlin and system resilience.",
                    category: "Micro-Internship",
                    providerName: "Resilience Labs",
                    skillsCovered: ["System Resilience", "DevOps", "Cybersecurity"],
                    duration: "2 Weeks",
                    link: "https://example.com/chaos"
                },
                {
                    title: "Cloud Infrastructure Specialist",
                    description: "Hands-on experience with AWS and Azure scaling.",
                    category: "Mentorship",
                    providerName: "Cloud Academy",
                    skillsCovered: ["Cloud Infrastructure", "AWS", "Azure"],
                    duration: "3 Months",
                    link: "https://example.com/cloud"
                }
            ]);
            console.log("Seeding complete.");
        }
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await mongoose.disconnect();
    }
}

check();
