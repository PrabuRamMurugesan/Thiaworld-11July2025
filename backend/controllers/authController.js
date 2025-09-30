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
