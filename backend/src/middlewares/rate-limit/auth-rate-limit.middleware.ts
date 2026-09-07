// src/middlewares/rate-limit/auth-rate-limit.middleware.ts

import rateLimit from "express-rate-limit";
import { errorResponse } from "../../utils/api-response.js";

const logoutLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 30,
  handler(req, res) {
    return errorResponse(
      res,
      429,
      "RATE_LIMIT_EXCEEDED",
      "Too many sign-out requests",
    );
  },
});

const oauthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  handler(req, res) {
    return errorResponse(
      res,
      429,
      "RATE_LIMIT_EXCEEDED",
      "Too many authentication requests",
    );
  },
});

export const authRateLimiter = (req: any, res: any, next: any) => {
  const path = req.path;

  if (path === "/sign-out") {
    return logoutLimiter(req, res, next);
  }

  // Rate limit all other auth-related requests (OAuth callbacks, etc.)
  return oauthLimiter(req, res, next);
};
