import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createAdminToken } from "../services/adminAuth.service.js";

export const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (username !== adminUsername || password !== adminPassword) {
    throw new ApiError(401, "Invalid admin username or password");
  }

  res.status(200).json({
    success: true,
    message: "Admin login successful",
    token: createAdminToken()
  });
});
