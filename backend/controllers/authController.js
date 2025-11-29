const User = require("../models/User");
const jwt = require("jsonwebtoken");

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
