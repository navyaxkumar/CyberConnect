import { getOwnProfile, updateOwnProfile, getPublicProfile } from "../services/profileService.js";

export const getMe = async (req, res) => {
  const user = await getOwnProfile(req.user._id);
  res.json({ user });
};

export const patchMe = async (req, res) => {
  const user = await updateOwnProfile(req.user._id, req.body);
  res.json({ user });
};

export const getByUsername = async (req, res) => {
  const user = await getPublicProfile(req.params.username);
  res.json({ user });
};
