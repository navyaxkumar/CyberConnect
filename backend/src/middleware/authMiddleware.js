import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { COOKIE_NAME } from "../utils/generateToken.js";
import { AppError } from "./appError.js";

export const protect = async (req, res, next) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return next(new AppError("Not authenticated", 401));

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch {
    return next(new AppError("Not authenticated", 401));
  }

  const user = await User.findById(payload.id);
  if (!user) return next(new AppError("Not authenticated", 401));

  req.user = user;
  next();
};