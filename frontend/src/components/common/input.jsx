export function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </span>
      {children}
      {error ? <span className="mt-2 block text-xs text-red-400">{error}</span> : null}
    </label>
  )
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`h-12 w-full rounded-xl border border-zinc-700 bg-[#101112] px-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 ${className}`}
      {...props}
    />
  )
}

export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`h-12 w-full rounded-xl border border-zinc-700 bg-[#101112] px-4 text-sm text-zinc-100 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`min-h-28 w-full rounded-xl border border-zinc-700 bg-[#101112] px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 ${className}`}
      {...props}
    />
  )
}
