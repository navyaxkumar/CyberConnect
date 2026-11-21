import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { COOKIE_NAME } from "../utils/generateToken.js";

const unauthorized = (res) => res.status(401).json({ message: "Not authenticated" });

export const protect = async (req, res, next) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return unauthorized(res);

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch {
    return unauthorized(res);
  }

  const user = await User.findById(payload.id);
  if (!user) return unauthorized(res);

  req.user = user;
  next();
};