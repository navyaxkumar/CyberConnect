import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const safeMethods = new Set(["get", "head", "options"]);
const csrfExemptPaths = new Set(["/auth/register", "/auth/login"]);

api.interceptors.request.use(async (config) => {
  const method = (config.method || "get").toLowerCase();
  const path = config.url?.split("?")[0];
  if (safeMethods.has(method) || csrfExemptPaths.has(path)) return config;

  const { data } = await axios.get(`${api.defaults.baseURL}/auth/csrf`, { withCredentials: true });
  config.headers.set("X-CSRF-Token", data.csrfToken);
  return config;
});

export default api;
