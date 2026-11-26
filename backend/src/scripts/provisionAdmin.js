import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";

if (process.env.ENABLE_ADMIN_PROVISIONING !== "true") {
  throw new Error("Set ENABLE_ADMIN_PROVISIONING=true for this one-time operation");
}
if (!process.env.ADMIN_EMAIL || !process.env.MONGO_URI && !process.env.MONGODB_URI) {
  throw new Error("ADMIN_EMAIL and MONGO_URI (or MONGODB_URI) are required");
}

try {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  const user = await User.findOneAndUpdate(
    { email: process.env.ADMIN_EMAIL.trim().toLowerCase() },
    { $set: { role: "admin" } },
    { new: true, runValidators: true }
  );
  if (!user) throw new Error("No existing account matches ADMIN_EMAIL; register it first");
  console.log(`Administrator role granted to ${user.email}`);
} finally {
  await mongoose.disconnect();
}
