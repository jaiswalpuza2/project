const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    const otp = user.getOTP();
    console.log(`------------- OTP FOR ${email}: ${otp} -------------`);
    await user.save({ validateBeforeSave: false });
    const message = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
        <h2 style="color: #2563eb; text-align: center;">Verify Your Email</h2>
        <p>Welcome to JobSphere, <strong>${name}</strong>!</p>
        <p>To complete your registration, please use the following One-Time Password (OTP):</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 12px; margin: 20px 0;">
          <h1 style="letter-spacing: 12px; margin: 0; color: #111827; font-size: 32px;">${otp}</h1>
        </div>
        <p style="color: #6b7280; font-size: 14px; text-align: center;">This code is valid for 15 minutes.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">If you didn't request this code, please ignore this email.</p>
      </div>
    `;
    // ASYNC SEND: Don't await email in production for speed
    sendEmail({
      email: user.email,
      subject: "JobSphere - Email Verification Code",
      message,
    }).catch(err => console.error("Registration Email Error:", err.message));

    sendTokenResponse(user, 201, res);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered. Please login or use a different email.",
      });
    }
    next(err);
  }
};
exports.verifyOTP = async (req, res, next) => {
  try {
    const crypto = require("crypto");
    const { otp } = req.body;
    if (!otp) {
      res.status(400);
      throw new Error("Please provide OTP");
    }
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");
    const user = await User.findOne({
      _id: req.user.id,
      otp: hashedOtp,
      otpExpire: { $gt: Date.now() },
    });
    if (!user) {
      res.status(400);
      throw new Error("Invalid or expired OTP");
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();
    res.status(200).json({
      success: true,
      data: "Email verified successfully",
    });
  } catch (err) {
    next(err);
  }
};
exports.resendOTP = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (user.isVerified) {
      res.status(400);
      throw new Error("Email already verified");
    }
    const otp = user.getOTP();
    await user.save({ validateBeforeSave: false });
    const message = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
        <h2 style="color: #2563eb; text-align: center;">New Verification Code</h2>
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>You requested a new verification code. Please use the OTP below:</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 12px; margin: 20px 0;">
          <h1 style="letter-spacing: 12px; margin: 0; color: #111827; font-size: 32px;">${otp}</h1>
        </div>
        <p style="color: #6b7280; font-size: 14px; text-align: center;">Valid for 15 minutes.</p>
      </div>
    `;
    try {
      await sendEmail({
        email: user.email,
        subject: "JobSphere - New Verification Code",
        message,
      });
    } catch (err) {
      console.error(`Email delivery failed: ${err.message}`);
    }
    res.status(200).json({
      success: true,
      data: "New OTP sent to email",
    });
  } catch (err) {
    next(err);
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);
    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide an email and password");
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401);
      throw new Error("Invalid credentials");
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid credentials");
    }
    if (!user.isVerified) {
      const otp = user.getOTP();
      console.log(`------------- LOGIN OTP FOR ${email}: ${otp} -------------`);
      await user.save({ validateBeforeSave: false });
      const verifyMessage = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
          <h2 style="color: #2563eb; text-align: center;">Verify Your Email</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>You recently logged in, but your email is not yet verified. Please use the OTP below to verify your account:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 12px; margin: 20px 0;">
            <h1 style="letter-spacing: 12px; margin: 0; color: #111827; font-size: 32px;">${otp}</h1>
          </div>
          <p style="color: #6b7280; font-size: 14px; text-align: center;">Valid for 15 minutes.</p>
        </div>
      `;
      // ASYNC SEND
      sendEmail({
        email: user.email,
        subject: "JobSphere - Email Verification Code",
        message: verifyMessage,
      }).catch(err => console.error("Login Verification Email Error:", err.message));

      return sendTokenResponse(user, 200, res);
    }
    const message = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2563eb;">Security Alert: New Login</h2>
        <p>Hello ${user.name},</p>
        <p>A new login was detected for your JobSphere account at <strong>${new Date().toLocaleString()}</strong>.</p>
        <p>If this was you, you can safely ignore this email. If not, please reset your password immediately.</p>
        <div style="margin-top: 20px;">
          <a href="#" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Secure My Account</a>
        </div>
      </div>
    `;
    // ASYNC SEND
    sendEmail({
      email: user.email,
      subject: "JobSphere - New Login Detected",
      message,
    }).catch(err => console.error("Login Alert Email Error:", err.message));

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error(`Login error: ${err.message}`);
    next(err);
  }
};
exports.forgotPasswordOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400);
      throw new Error("Please provide an email");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: true,
        data: "If an account with that email exists, an OTP has been sent.",
      });
    }
    const otp = user.getOTP();
    console.log(`------------- LOGIN OTP FOR ${email}: ${otp} -------------`);
    await user.save({ validateBeforeSave: false });
    const message = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
        <h2 style="color: #2563eb; text-align: center;">Login OTP</h2>
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>You requested to login via OTP. Please use the following One-Time Password:</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 12px; margin: 20px 0;">
          <h1 style="letter-spacing: 12px; margin: 0; color: #111827; font-size: 32px;">${otp}</h1>
        </div>
        <p style="color: #6b7280; font-size: 14px; text-align: center;">This code is valid for 15 minutes.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">If you didn't request this code, please ignore this email.</p>
      </div>
    `;
    try {
      await sendEmail({
        email: user.email,
        subject: "JobSphere - Login OTP",
        message,
      });
    } catch (err) {
      console.error(`Email delivery failed: ${err.message}`);
    }
    res.status(200).json({
      success: true,
      data: "OTP sent to email",
    });
  } catch (err) {
    next(err);
  }
};
exports.loginWithOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400);
      throw new Error("Please provide email and OTP");
    }
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");
    const user = await User.findOne({
      email,
      otp: hashedOtp,
      otpExpire: { $gt: Date.now() },
    });
    if (!user) {
      res.status(400);
      throw new Error("Invalid or expired OTP");
    }
    if (!user.isVerified) {
      user.isVerified = true;
    }
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password -otp -otpExpire");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
exports.getTalent = async (req, res, next) => {
  try {
    const talent = await User.find({ role: "freelancer" })
      .select("-password -otp -otpExpire")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: talent.length,
      data: talent,
    });
  } catch (err) {
    next(err);
  }
};
exports.getMentors = async (req, res, next) => {
  try {
    const mentors = await User.find({ isMentor: true })
      .select("-password -otp -otpExpire")
      .sort({ mentorRating: -1 });
    res.status(200).json({
      success: true,
      count: mentors.length,
      data: mentors,
    });
  } catch (err) {
    next(err);
  }
};
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      bio: req.body.bio,
      skills: req.body.skills,
      portfolio: req.body.portfolio,
      profileImage: req.body.profileImage,
      companyLogo: req.body.companyLogo,
      companyDescription: req.body.companyDescription,
      location: req.body.location,
      resumeUrl: req.body.resumeUrl,
      phone: req.body.phone,
      github: req.body.github,
      linkedin: req.body.linkedin,
      website: req.body.website,
      isMentor: req.body.isMentor,
      mentorBio: req.body.mentorBio,
      mentorExperience: req.body.mentorExperience,
      isProfileComplete: true, 
    };
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    await user.deleteOne();
    res.status(200).json({
      success: true,
      data: "Account deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error("Please provide current and new password");
    }
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(401);
      throw new Error("Incorrect current password");
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      data: "Password updated successfully",
    });
  } catch (err) {
    next(err);
  }
};
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isProfileComplete: user.isProfileComplete,
      isMentor: user.isMentor,
    },
  });
};