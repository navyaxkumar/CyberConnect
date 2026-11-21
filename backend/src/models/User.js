import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const ROLES = ["user", "admin"];

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String, required: true, unique: true, trim: true,
      lowercase: true, minlength: 3, maxlength: 30, match: /^[a-z0-9_]+$/,
    },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ROLES, default: "user" },
    bio: { type: String, maxlength: 300, default: "" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("User", userSchema);