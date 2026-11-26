// const STYLES = {
//   error: "border-red-500/40 bg-red-500/10 text-red-300",
//   success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
// };

// export default function Alert({ type = "error", children }) {
//   if (!children) return null;
//   return (
//     <div
//       role={type === "error" ? "alert" : "status"}
//       className={`rounded-md border px-3 py-2 text-sm ${STYLES[type]}`}
//     >
//       {children}
//     </div>
//   );
// }
const STYLES = {
  error: "border-red-300 bg-red-50 text-red-600",
  success: "border-emerald-300 bg-emerald-50 text-emerald-700",
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