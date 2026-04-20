const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const User = require("./models/User");

const resetPassword = async (email, newPassword) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for password reset.");

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User ${email} not found.`);
      process.exit(1);
    }

    user.password = newPassword;
    user.isVerified = true;

    await user.save();
    console.log(`Password for ${email} has been reset.`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const email = process.argv[2] || "testfreelancer518@gmail.com";
const password = process.argv[3] || "Password123";
resetPassword(email, password);
