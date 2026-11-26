import { CSRF_COOKIE_NAME, isValidCsrfToken } from "../utils/generateToken.js";
import { COOKIE_NAME } from "../utils/generateToken.js";
import { AppError } from "./appError.js";

export const requireCsrf = (req, _res, next) => {
  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = req.get("X-CSRF-Token");
  if (!cookieToken || !headerToken || cookieToken !== headerToken || !isValidCsrfToken(cookieToken)) {
    return next(new AppError("Invalid CSRF token", 403));
  }
  next();
};

export const requireCsrfForAuthenticatedCookie = (req, res, next) => {
  if (!req.cookies?.[COOKIE_NAME]) return next();
  return requireCsrf(req, res, next);
};

const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);
const csrfExemptPaths = new Set(["/api/auth/register", "/api/auth/login"]);

export const csrfProtection = (req, res, next) => {
  if (safeMethods.has(req.method) || csrfExemptPaths.has(req.path)) return next();
  return requireCsrfForAuthenticatedCookie(req, res, next);
};
