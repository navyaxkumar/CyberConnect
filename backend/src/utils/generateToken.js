import jwt from "jsonwebtoken";

export const COOKIE_NAME = "token";

const days = () => Number(process.env.JWT_EXPIRES_DAYS) || 7;

const baseCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});

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
};

export const clearAuthCookie = (res) => {
  res.clearCookie(COOKIE_NAME, baseCookieOptions());
};