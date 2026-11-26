import User from "../models/User.js";
import { AppError } from "../middleware/appError.js";

const privateProfileFields = "username email role bio profilePictureUrl";
const publicProfileFields = "username bio profilePictureUrl";

export const getOwnProfile = async (userId) => {
  const user = await User.findById(userId).select(privateProfileFields).lean();
  if (!user) throw new AppError("User not found", 404);
  return user;
};

export const updateOwnProfile = async (userId, updates) => {
  const safeUpdates = {};
  if (Object.hasOwn(updates, "username")) safeUpdates.username = updates.username.toLowerCase();
  if (Object.hasOwn(updates, "bio")) safeUpdates.bio = updates.bio;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: safeUpdates },
      { new: true, runValidators: true, context: "query" }
    ).select(privateProfileFields).lean();
    if (!user) throw new AppError("User not found", 404);
    return user;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError("Username is already in use", 409);
    }
    throw error;
  }
};

export const getPublicProfile = async (username) => {
  const user = await User.findOne({ username: username.toLowerCase() }).select(`${publicProfileFields} -_id`).lean();
  if (!user) throw new AppError("User not found", 404);
  return user;
};
