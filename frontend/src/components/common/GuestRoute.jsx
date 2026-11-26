import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import Loader from "./Loader.jsx";


export default function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
}