const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email, roleTags: user.roleTags },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, createdFrom } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const newUser = await User.create({
      name,
      email,
      phone,
      password,
      createdFrom,
    });

    // set cookie
    const token = generateToken(newUser);
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd, // false for localhost (HTTP)
      sameSite: isProd ? "none" : "lax", // lax for localhost
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      message: "User created",
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        roleTags: newUser.roleTags,
        createdFrom: newUser.createdFrom,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });
    if (user.status === "deactivated") {
      return res.status(403).json({
        message: "Your account is deactivated. Contact support.",
      });
    }

    // create token FIRST
    const token = generateToken(user);

    // set cookie
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd, // false for localhost (HTTP)
      sameSite: isProd ? "none" : "lax", // lax for localhost
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      message: "Login success",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roleTags: user.roleTags,
        createdFrom: user.createdFrom,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};
// ------------------------------------------------------
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.updateMyProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.userId,
      { name, email, phone },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updated,
    });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};
// Deactivate Account (Soft Delete)
exports.deactivateAccount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const updated = await User.findByIdAndUpdate(
      userId,
      {
        status: "deactivated",
        updated_at: new Date()
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "Account deactivated successfully",
      user: updated
    });
  } catch (error) {
    console.error("Deactivate error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Forgot Password - Send OTP
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({ 
        message: "If the email exists, an OTP has been sent to your email." 
      });
    }

    if (user.status === "deactivated") {
      return res.status(403).json({
        message: "Your account is deactivated. Contact support.",
      });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save OTP and expiration (10 minutes)
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Send OTP email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello ${user.name},</p>
        <p>You have requested to reset your password. Use the OTP below to verify your identity:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #d97706; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br/>Thiaworld Team</p>
      </div>
    `;

    try {
      await sendEmail(user.email, "Password Reset OTP - Thiaworld", html);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      console.error("Error details:", {
        message: emailError.message,
        code: emailError.code,
        command: emailError.command,
      });
      // Clear OTP if email fails
      user.resetPasswordOTP = null;
      user.resetPasswordOTPExpires = null;
      await user.save();
      
      // Provide more detailed error message in development
      const errorMessage = process.env.NODE_ENV === "production" 
        ? "Failed to send OTP email. Please try again later or contact support."
        : `Failed to send OTP email: ${emailError.message}. Please check SMTP configuration.`;
      
      return res.status(500).json({ 
        message: errorMessage 
      });
    }

    return res.json({ 
      message: "If the email exists, an OTP has been sent to your email." 
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({ 
      message: err.message || "Server Error. Please try again later." 
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or OTP" });
    }

    if (!user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (user.resetPasswordOTPExpires < new Date()) {
      user.resetPasswordOTP = null;
      user.resetPasswordOTPExpires = null;
      await user.save();
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid
    return res.json({ 
      message: "OTP verified successfully",
      verified: true 
    });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    // Validate password strength
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or OTP" });
    }

    if (!user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (user.resetPasswordOTPExpires < new Date()) {
      user.resetPasswordOTP = null;
      user.resetPasswordOTPExpires = null;
      await user.save();
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpires = null;
    await user.save();

    return res.json({ 
      message: "Password reset successfully. Please login with your new password." 
    });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};
