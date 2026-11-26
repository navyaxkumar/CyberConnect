import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/authService.js";
import { AuthContext } from "./authContextObject.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    let ignore = false;

    fetchCurrentUser()
      .then((u) => !ignore && setUser(u))
      .catch(() => !ignore && setUser(null))
      .finally(() => !ignore && setLoading(false));

    return () => {
      ignore = true;
    };
  }, []);

  const register = useCallback(async (data) => {
    const u = await registerUser(data);
    setUser(u);
    return u;
  }, []);

  const login = useCallback(async (data) => {
    const u = await loginUser(data);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, register, login, logout }),
    [user, loading, register, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}