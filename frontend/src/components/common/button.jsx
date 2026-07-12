const variants = {
  primary: 'bg-orange-600 text-white hover:bg-orange-500 border-orange-500/70',
  secondary:
    'bg-zinc-900 text-zinc-100 hover:bg-zinc-800 border-zinc-800',
  ghost:
    'bg-transparent text-zinc-300 hover:bg-zinc-900 border-transparent hover:border-zinc-800',
}

export default function Button({
  children,
  className = '',
  variant = 'primary',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
