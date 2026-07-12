export default function KPICard({ title, value, tone = 'blue' }) {
  const toneClasses = {
    orange: 'border-l-orange-600',
    green: 'border-l-emerald-500',
    blue: 'border-l-sky-500',
  }

  return (
    <article
      className={`h-[76px] border border-[#4b5563] border-l-4 bg-[#121212] px-3 py-3 ${toneClasses[tone]}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">{title}</p>
      <p className="mt-2 text-[25px] font-bold leading-none text-zinc-100">{value}</p>
    </article>
  )
}
