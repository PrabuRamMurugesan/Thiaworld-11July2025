const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const { sendOTPSMS } = require("../utils/bsnlSmsService");
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

// Send Login OTP via SMS
exports.sendLoginOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Clean phone number
    let cleanPhone = phone.replace(/[\s\+\-\(\)]/g, "");
    if (cleanPhone.startsWith("91") && cleanPhone.length === 12) {
      cleanPhone = cleanPhone.substring(2);
    }

    // Validate Indian mobile number
    if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({ message: "Invalid Indian mobile number format" });
    }

    // Find user by phone number
    const user = await User.findOne({ phone: cleanPhone });
    if (!user) {
      // Don't reveal if user exists for security
      return res.json({
        message: "If the phone number is registered, an OTP has been sent.",
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
    user.loginOTP = otp;
    user.loginOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Log OTP for testing (remove in production)
    console.log(`🔑 Generated OTP for ${cleanPhone}: ${otp}`);
    console.log(`⏰ OTP expires at: ${new Date(Date.now() + 10 * 60 * 1000).toISOString()}`);

    // Send OTP via BSNL SMS
    try {
      const smsResult = await sendOTPSMS(cleanPhone, otp, "login");
      
      console.log(`📱 SMS Result:`, JSON.stringify(smsResult, null, 2));
      
      if (!smsResult.success) {
        console.error("❌ SMS sending failed:", smsResult.message);
        console.error("   Response:", smsResult.response);
        console.error("   Error:", smsResult.error);
        console.error("   Endpoint tried:", smsResult.endpoint);
        
        // Log OTP prominently for testing (always show, not just dev mode)
        console.warn(`\n${"=".repeat(80)}`);
        console.warn(`⚠️  BSNL SMS FAILED - OTP FOR TESTING:`);
        console.warn(`   Phone: ${cleanPhone}`);
        console.warn(`   OTP: ${otp}`);
        console.warn(`   Expires: ${new Date(Date.now() + 10 * 60 * 1000).toISOString()}`);
        console.warn(`   Use this OTP to test login manually`);
        console.warn(`${"=".repeat(80)}\n`);
        
        // Always keep OTP saved for testing (don't clear it)
        // User can still test login with OTP from console
        
        // Return user-friendly error message
        // In development, include OTP for testing
        const isDev = process.env.NODE_ENV === "development";
        
        // Check if it's a template variable name issue
        const isTemplateIssue = smsResult.error?.includes("Invalid Input") || 
                                smsResult.message?.includes("Template variable name mismatch");
        
        // Always include OTP in response for testing (even in production, since SMS failed)
        // But show user-friendly message
        return res.status(500).json({
          message: "Unable to send OTP SMS at the moment. Please try again later or contact support.",
          error: smsResult.message || smsResult.error,
          // Include OTP for testing since SMS failed
          debugOTP: otp, // Include even in production for now, since SMS is not working
          troubleshooting: {
            issue: isTemplateIssue 
              ? "BSNL SMS API: Template variable name mismatch - All 80 request formats returned 'Invalid Input'"
              : "BSNL SMS API configuration issue - all request formats returned 'Invalid Input'",
            note: "OTP has been generated and saved. Check browser console or backend logs for OTP to test login manually.",
            action: isTemplateIssue
              ? "Check BSNL portal for correct template variable name. See backend console logs for detailed instructions."
              : "Check backend console logs for detailed error information.",
            support: "Contact BSNL support: brps_support@bsnl.co.in",
            ...(smsResult.attemptedFormats && {
              attemptedFormats: smsResult.attemptedFormats
            })
          }
        });
      }

      // SMS was sent successfully
      console.log(`✅ Login OTP sent successfully to ${cleanPhone} via ${smsResult.endpoint}`);
      return res.json({
        message: "If the phone number is registered, an OTP has been sent.",
        phoneSent: true,
        // In development, include OTP in response for testing (REMOVE IN PRODUCTION!)
        ...(process.env.NODE_ENV === "development" && { 
          debugOTP: otp,
          note: "This is only visible in development mode"
        }),
      });
    } catch (smsError) {
      console.error("❌ SMS Error:", smsError);
      console.error("   Error details:", smsError.message);
      console.error("   Stack:", smsError.stack);
      
      // Log OTP for manual testing in development
      if (process.env.NODE_ENV === "development") {
        console.warn(`⚠️ DEVELOPMENT MODE: SMS error occurred`);
        console.warn(`   OTP generated: ${otp} (valid for 10 minutes)`);
        console.warn(`   You can use this OTP to test login manually`);
        
        // Return error but include OTP for testing
        return res.status(500).json({
          message: "Failed to send OTP SMS. Check server logs for OTP (dev mode only).",
          error: smsError.message,
          debugOTP: otp,
          note: "SMS error - OTP logged in console for testing",
        });
      }
      
      // In production, clear OTP and return error
      user.loginOTP = null;
      user.loginOTPExpires = null;
      await user.save();
      
      return res.status(500).json({
        message: "Failed to send OTP SMS. Please try again later.",
        error: smsError.message,
      });
    }
  } catch (err) {
    console.error("Send Login OTP Error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Verify Login OTP and Login
exports.verifyLoginOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone number and OTP are required" });
    }

    // Clean phone number
    let cleanPhone = phone.replace(/[\s\+\-\(\)]/g, "");
    if (cleanPhone.startsWith("91") && cleanPhone.length === 12) {
      cleanPhone = cleanPhone.substring(2);
    }

    // Validate OTP format
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      return res.status(400).json({ message: "OTP must be exactly 6 digits" });
    }

    // Find user by phone number
    const user = await User.findOne({ phone: cleanPhone });
    if (!user) {
      return res.status(400).json({ message: "Invalid phone number or OTP" });
    }

    if (user.status === "deactivated") {
      return res.status(403).json({
        message: "Your account is deactivated. Contact support.",
      });
    }

    // Check if OTP exists and is not expired
    if (!user.loginOTP || !user.loginOTPExpires) {
      return res.status(400).json({ message: "OTP not found or expired. Please request a new one." });
    }

    if (user.loginOTPExpires < new Date()) {
      user.loginOTP = null;
      user.loginOTPExpires = null;
      await user.save();
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Verify OTP
    if (user.loginOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid - clear OTP and login user
    user.loginOTP = null;
    user.loginOTPExpires = null;
    user.loginAttempts = 0;
    user.lastLoginAt = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user);

    // Set cookie
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roleTags: user.roleTags,
        createdFrom: user.createdFrom,
      },
    });
  } catch (err) {
    console.error("Verify Login OTP Error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};
