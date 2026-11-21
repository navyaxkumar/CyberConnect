import api from "./api.js";

export const registerUser = async (data) => (await api.post("/auth/register", data)).data.user;

export const loginUser = async (data) => (await api.post("/auth/login", data)).data.user;

export const logoutUser = async () => {
  await api.post("/auth/logout");
};

export const fetchCurrentUser = async () => (await api.get("/auth/me")).data.user;