const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Generate OTP
    const otp = user.getOTP();
    console.log(`------------- OTP FOR ${email}: ${otp} -------------`);
    await user.save({ validateBeforeSave: false });

    // Send Welcome OTP Email
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

    try {
      await sendEmail({
        email: user.email,
        subject: "JobSphere - Email Verification Code",
        message,
      });
    } catch (err) {
      console.log("Email could not be sent");
    }

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

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Private
exports.verifyOTP = async (req, res, next) => {
  try {
    const crypto = require("crypto");
    const { otp } = req.body;

    if (!otp) {
      res.status(400);
      throw new Error("Please provide OTP");
    }

    // Hash the submitted OTP to compare
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

    // Mark as verified
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

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Private
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

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);

    // Validate email & password
    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide an email and password");
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    // If user is not verified, send OTP and redirect
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

      try {
        await sendEmail({
          email: user.email,
          subject: "JobSphere - Email Verification Code",
          message: verifyMessage,
        });
      } catch (err) {
        console.error(`Email delivery failed: ${err.message}`);
      }

      return sendTokenResponse(user, 200, res);
    }

    // Send Login Notification
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

    try {
      await sendEmail({
        email: user.email,
        subject: "JobSphere - New Login Detected",
        message,
      });
    } catch (err) {
      console.log("Email could not be sent");
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error(`Login error: ${err.message}`);
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
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

// @desc    Get user profile by ID
// @route   GET /api/auth/profile/:id
// @access  Public
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

// @desc    Get all freelancers (Talent Search)
// @route   GET /api/auth/talent
// @access  Private
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

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
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
      isProfileComplete: true, // Mark profile as complete after they finish the wizard
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

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
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
    },
  });
};