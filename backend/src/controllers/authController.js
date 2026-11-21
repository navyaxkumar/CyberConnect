import bcrypt from "bcrypt";
import User from "../models/User.js";
import { setAuthCookie, clearAuthCookie } from "../utils/generateToken.js";

// Used so a login for an unknown email takes as long as one for a real email.
const DUMMY_HASH = await bcrypt.hash("not-a-real-password", 12);

export const register = async (req, res) => {
  // Pick fields explicitly so a client can never set role or other protected fields.
  const { username, email, password } = req.body;

  try {
    const user = await User.create({ username, email, password });
    setAuthCookie(res, user._id);
    res.status(201).json({ user });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Username or email is already in use" });
    }
    throw err;
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
  const passwordOk = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);

  if (!user || !passwordOk) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  setAuthCookie(res, user._id);
  res.json({ user });
};

export const logout = (req, res) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out" });
};

export const me = (req, res) => {
  res.json({ user: req.user });
};