const adminMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (token === "Bearer adminkey123") {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized access" });
  }
};    

module.exports = adminMiddleware;
