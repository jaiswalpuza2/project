const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["freelancer", "employer", "admin"],
      default: "freelancer",
    },
    profileImage: {
      type: String,
      default: "no-photo.jpg",
    },
    skills: [String],
    portfolio: [
      {
        title: String,
        description: String,
        link: String,
      },
    ],
    resumeUrl: String,
    companyLogo: String,
    companyDescription: String,
    location: String,
    bio: String,
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash 6-digit OTP
userSchema.methods.getOTP = function () {
  const crypto = require("crypto");
  // Generate 6-digit random number
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash OTP and set to otp field
  this.otp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  // Set expire (15 minutes)
  this.otpExpire = Date.now() + 15 * 60 * 1000;

  return otp;
};

module.exports = mongoose.model("User", userSchema);