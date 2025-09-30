const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function requireUser(req, res, next) {
  try {
    // Get token from cookie OR Authorization: Bearer <token>
    let token = null;

    // 1) Cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 2) Bearer header (fallback)
    if (!token) {
      const auth = req.headers.authorization || "";
      if (auth.startsWith("Bearer ")) {
        token = auth.slice(7).trim();
      }
    }

    if (!token) {
      return res.status(401).json({ message: "Login required" });
    }

    // Verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support both shapes: {_id: ...} or {id: ...}
    const userId = decoded._id || decoded.id;
    if (!userId) {
      return res.status(401).json({ message: "Login required" });
    }

    // Load user (or skip DB if you don’t need the full document)
    const user = await User.findById(userId).select("_id name email roleTags");
    if (!user) {
      return res.status(401).json({ message: "Login required" });
    }

    req.user = user;
    next();
  } catch (err) {
    // Optional: temporary debug
    // console.log("requireUser error:", err);
    return res.status(401).json({ message: "Login required" });
  }
};
