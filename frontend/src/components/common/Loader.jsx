export default function Loader({ label = "Loading..." }) {
  return (
    <div role="status" className="flex items-center gap-3 py-8 text-slate-400">
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-emerald-400"
      />
      <span>{label}</span>
    </div>
  );
}