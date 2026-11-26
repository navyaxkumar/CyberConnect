import jwt from "jsonwebtoken";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const COOKIE_NAME = "token";
export const CSRF_COOKIE_NAME = "csrfToken";

const days = () => Number(process.env.JWT_EXPIRES_DAYS) || 7;

const baseCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
});

export const createCsrfToken = () => {
  const nonce = randomBytes(32).toString("hex");
  const signature = createHmac("sha256", process.env.JWT_SECRET).update(nonce).digest("hex");
  return `${nonce}.${signature}`;
};

export const isValidCsrfToken = (token) => {
  if (typeof token !== "string") return false;
  const [nonce, signature, extra] = token.split(".");
  if (extra !== undefined || !/^[a-f0-9]{64}$/.test(nonce || "") || !/^[a-f0-9]{64}$/.test(signature || "")) return false;
  const expected = createHmac("sha256", process.env.JWT_SECRET).update(nonce).digest();
  return timingSafeEqual(expected, Buffer.from(signature, "hex"));
};

export const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: `${days()}d`,
  });

export const setAuthCookie = (res, userId) => {
  res.cookie(COOKIE_NAME, signToken(userId), {
    ...baseCookieOptions(),
    maxAge: days() * 24 * 60 * 60 * 1000,
  });
  const csrfToken = createCsrfToken();
  res.cookie(CSRF_COOKIE_NAME, csrfToken, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: days() * 24 * 60 * 60 * 1000,
  });
  return csrfToken;
};

export const clearAuthCookie = (res) => {
  res.clearCookie(COOKIE_NAME, baseCookieOptions());
  res.clearCookie(CSRF_COOKIE_NAME, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
};
