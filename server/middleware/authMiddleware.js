import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authData = typeof req.auth === "function" ? req.auth() : null;

    if (!authData || !authData.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Fetch full user
    const user = await User.findById(authData.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // ✅ attach user document
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};
