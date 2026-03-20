const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./backend/models/User");
const Job = require("./backend/models/Job");

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const employer = await User.findOne({ email: "testemployer@example.com" });
        if (employer) {
            console.log("Employer found:", employer.name, employer._id);
            const jobs = await Job.find({ employer: employer._id });
            console.log("Jobs found for employer:", jobs.length);
            jobs.forEach(j => console.log(`- ${j.title} (${j.budget})`));
        } else {
            console.log("Employer testemployer@example.com not found");
        }

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verify();
