const statusClasses = {
  Completed: 'bg-lime-700 text-black',
  'On Trip': 'bg-sky-500 text-black',
  Dispatched: 'bg-sky-500 text-black',
  Draft: 'bg-zinc-500 text-black',
}

export default function TripTable({ trips }) {
  return (
    <section>
      <h2 className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-zinc-200">
        Recent Trips
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[610px] text-left">
          <thead className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">
            <tr>
              <th className="px-2 py-2 font-semibold">Trip</th>
              <th className="px-2 py-2 font-semibold">Vehicle</th>
              <th className="px-2 py-2 font-semibold">Driver</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-2 py-2 font-semibold">ETA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#242526] border-t border-[#242526] text-[12px] font-semibold">
            {trips.map((trip) => (
              <tr key={trip.id} className="text-zinc-300">
                <td className="px-2 py-2 text-zinc-100">{trip.id}</td>
                <td className="px-2 py-2">{trip.vehicle}</td>
                <td className="px-2 py-2">{trip.driver}</td>
                <td className="px-5 py-1.5">
                  <span className={`inline-flex min-w-[105px] rounded-[5px] px-3 py-1 ${statusClasses[trip.status]}`}>
                    {trip.status}
                  </span>
                </td>
                <td className="px-2 py-2">{trip.eta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
