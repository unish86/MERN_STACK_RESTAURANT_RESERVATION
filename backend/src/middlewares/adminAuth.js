import { ApiError } from "../utils/ApiError.js";
import { verifyAdminToken } from "../services/adminAuth.service.js";

export const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!verifyAdminToken(token)) {
    throw new ApiError(401, "Admin login required");
  }

  next();
};
