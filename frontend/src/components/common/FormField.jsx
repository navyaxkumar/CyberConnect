export default function FormField({ id, label, error, hint, rightSlot, ...inputProps }) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-200">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={describedBy}
          className={`w-full rounded-md border bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500 ${
            error ? "border-red-500" : "border-slate-700"
          } ${rightSlot ? "pr-10" : ""}`}
          {...inputProps}
        />
        {rightSlot}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}