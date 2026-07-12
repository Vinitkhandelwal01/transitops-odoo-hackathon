import Navbar from '../components/layout/navbar.jsx'
import Sidebar from '../components/layout/sidebar.jsx'

const permissions = [
  { role: 'Fleet Manager', fleet: 'check', drivers: 'check', trips: '--', fuel: '--', analytics: 'check' },
  { role: 'Dispatcher', fleet: 'view', drivers: '--', trips: 'check', fuel: '--', analytics: '--' },
  { role: 'Safety Officer', fleet: '--', drivers: 'check', trips: 'view', fuel: '--', analytics: '--' },
  { role: 'Financial Analyst', fleet: 'view', drivers: '--', trips: '--', fuel: 'check', analytics: 'check' },
]

export default function Settings() {
  return (
    <div className="min-h-screen bg-[#121212] p-1 text-zinc-100 md:p-2">
      <div className="min-h-[calc(100vh-16px)] border-2 border-[#9ca3af] bg-[#101010] lg:grid lg:grid-cols-[178px_1fr]">
        <Sidebar />
        <main className="min-w-0">
          <Navbar />
          <div className="grid gap-16 px-4 py-4 xl:grid-cols-[360px_minmax(520px,1fr)] xl:gap-32">
            <section>
              <h2 className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-zinc-200">
                General
              </h2>
              <form className="space-y-3">
                {[
                  ['Depot Name', 'Gandhinagar Depot'],
                  ['Currency', 'INR (Rs.)'],
                  ['Distance Unit', 'Kilometers'],
                ].map(([label, placeholder]) => (
                  <label key={label} className="block">
                    <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
                      {label}
                    </span>
                    <input
                      placeholder={placeholder}
                      className="h-8 w-full rounded-[6px] border border-[#4b5563] bg-[#151617] px-3 text-[12px] font-semibold text-zinc-300 outline-none placeholder:text-zinc-600 focus:border-sky-500"
                    />
                  </label>
                ))}
                <button className="mt-4 h-10 w-[170px] rounded-[8px] bg-sky-500 px-4 text-[12px] font-semibold text-black hover:bg-sky-400">
                  Save changes
                </button>
              </form>
            </section>
            <section className="mt-2 xl:mt-0">
              <h2 className="mb-3 text-[13px] font-bold uppercase tracking-[0.08em] text-zinc-200">
                Role Based Access (RBAC)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left">
                  <thead className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                    <tr>
                      <th className="px-2 py-2 font-semibold">Role</th>
                      <th className="px-2 py-2 text-center font-semibold">Fleet</th>
                      <th className="px-2 py-2 text-center font-semibold">Drivers</th>
                      <th className="px-2 py-2 text-center font-semibold">Trips</th>
                      <th className="px-2 py-2 text-center font-semibold">Fuel/Exp.</th>
                      <th className="px-2 py-2 text-center font-semibold">Analytics</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242526] border-t border-[#242526] text-[12px] font-semibold text-zinc-300">
                    {permissions.map((permission) => (
                      <tr key={permission.role}>
                        <td className="px-2 py-3 text-zinc-100">{permission.role}</td>
                        <td className="px-2 py-3 text-center">{permission.fleet}</td>
                        <td className="px-2 py-3 text-center">{permission.drivers}</td>
                        <td className="px-2 py-3 text-center">{permission.trips}</td>
                        <td className="px-2 py-3 text-center">{permission.fuel}</td>
                        <td className="px-2 py-3 text-center">{permission.analytics}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
