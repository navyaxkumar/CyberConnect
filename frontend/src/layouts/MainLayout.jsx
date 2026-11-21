import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

export default function MainLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [logoutFailed, setLogoutFailed] = useState(false);

  const handleLogout = async () => {
    setLogoutFailed(false);
    try {
      await logout();
      navigate("/", { replace: true });
    } catch {
      setLogoutFailed(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold">
            CyberConnect
          </Link>

          <div className="flex items-center gap-4 text-sm">
            {loading ? null : user ? (
              <>
                <Link to="/profile" className="text-slate-300 hover:text-white">
                  {user.username}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md border border-slate-700 px-3 py-1 hover:bg-slate-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-emerald-600 px-3 py-1 font-medium text-white hover:bg-emerald-500"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
        {logoutFailed && (
          <p role="alert" className="bg-red-500/10 px-4 py-2 text-center text-sm text-red-300">
            Logout failed. Please try again.
          </p>
        )}
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}