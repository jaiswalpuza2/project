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
    phone: String,
    github: String,
    linkedin: String,
    website: String,
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isMentor: {
      type: Boolean,
      default: false,
    },
    mentorBio: {
      type: String,
    },
    mentorRating: {
      type: Number,
      default: 5.0,
    },
    mentorExperience: {
      type: Number,
      default: 0,
    },
    otp: String,
    otpExpire: Date,
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    mutedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.getOTP = function () {
  const crypto = require("crypto");
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
  this.otpExpire = Date.now() + 15 * 60 * 1000;
  return otp;
};
module.exports = mongoose.model("User", userSchema);