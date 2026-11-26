import { setAuthCookie, clearAuthCookie } from "../utils/generateToken.js";
import { registerUser, loginUser } from "../services/authService.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const user = await registerUser({ username, email, password });
  setAuthCookie(res, user._id);
  res.status(201).json({ user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await loginUser({ email, password });
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