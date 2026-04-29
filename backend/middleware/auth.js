const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    const user = jwt.verify(token, secretKey);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  });
};

module.exports = { auth, isAdmin };
