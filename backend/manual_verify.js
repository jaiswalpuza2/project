const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const User = require("./models/User");

const verifyUser = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for verification.");

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User ${email} not found.`);
      process.exit(1);
    }

    user.isVerified = true;

    user.isProfileComplete = true; 

    await user.save();
    console.log(`User ${email} is now verified and profile marked complete.`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const email = process.argv[2] || "testfreelancer_1311@example.com";
verifyUser(email);
