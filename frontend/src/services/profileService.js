import api from "./api.js";

export const fetchMyProfile = async () => (await api.get("/users/me")).data.user;

export const updateMyProfile = async (updates) =>
  (await api.patch("/users/me", updates)).data.user;

export const fetchPublicProfile = async (username) =>
  (await api.get(`/users/${encodeURIComponent(username)}`)).data.user;
