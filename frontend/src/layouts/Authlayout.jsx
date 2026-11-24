import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen place-items-center overflow-x-hidden bg-[#eef1f5] px-4 py-6 sm:px-6 lg:px-10">
      <Outlet />
    </div>
  );
}