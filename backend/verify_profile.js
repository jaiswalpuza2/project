const mongoose = require("mongoose");
const User = require("./models/User");
const dotenv = require("dotenv");

dotenv.config();

const verifyUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: "testerfix@example.com" });
        if (user) {
            console.log("User found:");
            console.log("Bio:", user.bio);
            console.log("Skills:", user.skills);
            console.log("Resume URL:", user.resumeUrl);
        } else {
            console.log("User not found");
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyUser();
