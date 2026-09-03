import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * Middleware to protect routes and verify JWT token
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for token in HTTP-only cookies or Authorization header
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found or token invalid" });
      }

      if (!req.user.isActive) {
        return res.status(403).json({ message: "User account is deactivated" });
      }

      next();
    } catch (error) {
      console.error("Token verification error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};


/**
 * Middleware for role-based access authorization
 * @param  {...string} roles Allowed roles for the endpoint
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user ? req.user.role : "Unknown"}' is not authorized to access this resource`,
      });
    }
    next();
  };
};
