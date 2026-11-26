import bcrypt from "bcrypt";
import User from "../models/User.js";
import { AppError } from "../middleware/appError.js";

const DUMMY_HASH = await bcrypt.hash("not-a-real-password", 12);

export const registerUser = async ({ username, email, password }) => {
  try {
    return await User.create({ username, email, password });
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError("Username or email is already in use", 409);
    }
    throw error;
  }
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  const passwordOk = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);

  if (!user || !passwordOk) {
    throw new AppError("Invalid email or password", 401);
  }

  return user;
};

