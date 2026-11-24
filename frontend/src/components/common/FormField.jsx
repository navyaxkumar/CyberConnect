export default function FormField({
  id,
  label,
  error,
  hint,
  rightSlot,
  leftIcon: LeftIcon,
  ...inputProps
}) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div>
      {label ? (
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
      ) : null}
      <div className="relative">
        {LeftIcon ? (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-brand">
            <LeftIcon size={19} strokeWidth={1.8} aria-hidden="true" />
          </span>
        ) : null}
        <input
          id={id}
          name={id}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={describedBy}
          className={`h-[52px] w-full rounded-[5px] border bg-white text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-brand/10 ${
            LeftIcon ? "pl-12" : "pl-4"
          } ${rightSlot ? "pr-12" : "pr-4"} ${
            error ? "border-red-400" : "border-slate-200"
          } shadow-[0_5px_18px_rgba(15,23,42,0.06)]`}
          {...inputProps}
        />
        {rightSlot}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}