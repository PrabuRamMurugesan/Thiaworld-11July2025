// backend/controllers/adminAuthController.js
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
const pwdRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",.<>/?]).{8,}$/;
const phoneRegex = /^[0-9]{10}$/;

function signToken(user, rememberMe = false) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      roles: user.roles,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: rememberMe ? "30d" : "1d",
    }
  );
}

// ---------------- SIGNUP (same as before) ----------------
exports.registerAdmin = async (req, res) => {
  try {
    const { fullName, email, phone, password, confirmPassword, termsAccepted } =
      req.body || {};

    const errors = {};

    if (!fullName || fullName.trim().length < 3) {
      errors.fullName =
        "Full name is required and must be at least 3 characters.";
    } else if (!/^[A-Za-z\s]+$/.test(fullName.trim())) {
      errors.fullName = "Full name can contain only letters and spaces.";
    }

    if (!email || !emailRegex.test(email)) {
      errors.email = "Valid email address is required.";
    }

    if (!phone) {
      errors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(String(phone).trim())) {
      errors.phone = "Phone must be a valid 10-digit number.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (!pwdRegex.test(password)) {
      errors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, number and special character.";
    }

    if (!confirmPassword || confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (!termsAccepted) {
      errors.termsAccepted = "You must accept the terms and conditions.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ ok: false, errors });
    }

    const lowerEmail = email.toLowerCase();
    const existing = await User.findOne({ email: lowerEmail });
    if (existing) {
      return res.status(409).json({
        ok: false,
        message: "An account with this email already exists.",
      });
    }

    const user = new User({
      name: fullName.trim(),
      email: lowerEmail,
      phone: String(phone).trim(),
      password,
      roles: ["admin"],
      createdFrom: "thiaworld-admin",
      isVerified: false,
    });

    await user.save();

    return res.status(201).json({
      ok: true,
      message:
        "Admin registered successfully. Please login and verify your email.",
    });
  } catch (err) {
    console.error("registerAdmin error:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error while registering admin.",
    });
  }
};

// helper: send verification email
// helper: send verification email
async function sendVerificationEmail(user) {
  const token = crypto.randomBytes(32).toString("hex");

  user.emailVerificationToken = token;
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
  await user.save();

  const verifyUrl = `${process.env.APP_BASE_URL}/api/admin/verify-email?token=${token}`;

  // ✅ email goes ONLY to your SMTP mailbox (Zoho/Gmail), not to admin’s email
  const targetEmail = process.env.SMTP_USER; // e.g. praburambbs@zohomail.in

  const html = `
    <p>Hello,</p>
    <p>An admin account was created for Thiaworld.</p>
    <p><strong>Admin email:</strong> ${user.email}</p>
    <p><strong>Admin name:</strong> ${user.name}</p>
    <p>Click the link below to verify this admin account:</p>
    <p><a href="${verifyUrl}" target="_blank">Verify this admin account</a></p>
    <p>This link will expire in 24 hours.</p>
    <p>– Thiaworld Jewellery</p>
  `;

  await sendEmail(
    targetEmail,
    "Verify your Thiaworld admin account",
    html
  );
}

// ---------------- LOGIN WITH VERIFICATION ----------------
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body || {};
    const errors = {};

    if (!email || !emailRegex.test(email)) {
      errors.email = "Valid email address is required.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ ok: false, errors });
    }

    const lowerEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowerEmail });

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.roles || !user.roles.includes("admin")) {
      return res.status(403).json({
        ok: false,
        message: "You do not have admin access.",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      await user.save();

      return res.status(401).json({
        ok: false,
        message: "Invalid email or password.",
      });
    }

    // here password is correct

    // if not verified → send email and stop
    if (!user.isVerified) {
      await sendVerificationEmail(user);

      return res.status(403).json({
        ok: false,
        requireVerification: true,
        message:
          "A verification link has been sent to your email. Please verify and then login again.",
      });
    }

    // verified: normal login
    user.loginAttempts = 0;
    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken(user, !!rememberMe);

    return res.json({
      ok: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roles: user.roles,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (err) {
    console.error("loginAdmin error:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error while logging in.",
    });
  }
};

// ---------------- VERIFY EMAIL ENDPOINT ----------------
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query || {};
    if (!token) {
      return res.status(400).send("Invalid verification link.");
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).send("Verification link is invalid or expired.");
    }

    user.isVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    return res.send(`
      <html>
        <body>
          <h2>Email Verified</h2>
          <p>Your admin email has been verified successfully.</p>
          <p>You can now return to the site and login to access the admin dashboard.</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("verifyEmail error:", err);
    return res.status(500).send("Server error while verifying email.");
  }
};
