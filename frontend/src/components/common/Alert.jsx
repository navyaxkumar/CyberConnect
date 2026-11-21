const STYLES = {
  error: "border-red-500/40 bg-red-500/10 text-red-300",
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
};

export default function Alert({ type = "error", children }) {
  if (!children) return null;
  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`rounded-md border px-3 py-2 text-sm ${STYLES[type]}`}
    >
      {children}
    </div>
  );
}