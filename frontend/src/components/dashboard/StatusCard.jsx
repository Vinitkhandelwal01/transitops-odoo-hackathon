const statusStyles = {
  Available: 'bg-emerald-500',
  'On Trip': 'bg-sky-500',
  'In Shop': 'bg-orange-500',
  Retired: 'bg-red-300',
}

export default function StatusCard({ vehicles }) {
  return (
    <section>
      <h2 className="mb-3 text-[13px] font-bold uppercase tracking-[0.08em] text-zinc-200">
        Vehicle Status
      </h2>

      <div className="space-y-3">
        {vehicles.map((vehicle) => (
          <div key={vehicle.label} className="grid grid-cols-[74px_1fr] items-center gap-3">
            <div className="text-[12px] font-semibold text-zinc-300">{vehicle.label}</div>
            <div className="h-3 bg-[#232426]">
              <div className={`h-full ${statusStyles[vehicle.label]} ${vehicle.widthClass}`} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
