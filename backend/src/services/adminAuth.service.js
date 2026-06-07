import crypto from "crypto";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const getSecret = () =>
  process.env.ADMIN_TOKEN_SECRET || process.env.MONGODB_URI || "restaurant-admin-secret";

export const createAdminToken = () => {
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = Buffer.from(JSON.stringify({ role: "admin", expiresAt })).toString("base64url");
  const signature = crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");

  return `${payload}.${signature}`;
};

export const verifyAdminToken = (token) => {
  if (!token || !token.includes(".")) {
    return false;
  }

  const [payload, signature] = token.split(".");
  const expectedSignature = crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");

  if (
    signature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    return false;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return decoded.role === "admin" && decoded.expiresAt > Date.now();
  } catch {
    return false;
  }
};
