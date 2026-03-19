const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.auth = async (req, res, next) => {
  try {
    // 1. Get token from header
    const token = req.headers.authorization?.split(" ")[1];

    // 2. If no token → return 401
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing. Access denied.",
      });
    }

    // 3. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    }
    // 4. If token invalid → return 401
    catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // 5. Find user in MongoDB
    const user = await User.findById(decoded.id).select("-password");

    // 6. If user not found → return 401
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // 7. Attach user to req.user
    req.user = user;

    // 8. Call next()
    next();

  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};