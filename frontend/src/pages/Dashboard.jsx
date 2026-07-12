import KPICard from '../components/dashboard/KPICard.jsx'
import StatusCard from '../components/dashboard/StatusCard.jsx'
import TripTable from '../components/dashboard/TripTable.jsx'
import Navbar from '../components/layout/navbar.jsx'
import Sidebar from '../components/layout/sidebar.jsx'

const kpis = [
  { title: 'Active Vehicles', value: '53', tone: 'blue' },
  { title: 'Available Vehicles', value: '42', tone: 'green' },
  { title: 'Vehicles In Maintenance', value: '05', tone: 'orange' },
  { title: 'Active Trips', value: '18', tone: 'blue' },
  { title: 'Pending Trips', value: '09', tone: 'blue' },
  { title: 'Drivers On Duty', value: '26', tone: 'blue' },
  { title: 'Fleet Utilization', value: '81%', tone: 'green' },
]

const trips = [
  { id: 'TR001', vehicle: 'VAN-05', driver: 'Alex', status: 'On Trip', eta: '45 min' },
  { id: 'TR002', vehicle: 'TRK-13', driver: 'John', status: 'Completed', eta: '--' },
  { id: 'TR003', vehicle: 'MINI-09', driver: 'Priya', status: 'Dispatched', eta: '1h 10m' },
  { id: 'TR004', vehicle: '--', driver: '--', status: 'Draft', eta: 'Awaiting vehicle' },
]

const vehicles = [
  { label: 'Available', widthClass: 'w-[72%]' },
  { label: 'On Trip', widthClass: 'w-[31%]' },
  { label: 'In Shop', widthClass: 'w-[10%]' },
  { label: 'Retired', widthClass: 'w-[5%]' },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#121212] p-1 text-zinc-100 md:p-2">
      <div className="min-h-[calc(100vh-16px)] border-2 border-[#9ca3af] bg-[#101010] lg:grid lg:grid-cols-[178px_1fr]">
        <Sidebar />
        <main className="min-w-0">
          <Navbar />
          <div className="px-4 py-4">
            <section>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500">
                Filters
              </p>
              <div className="flex flex-wrap gap-3">
                {['Vehicle Type: All', 'Status: All', 'Region: All'].map((filter) => (
                  <select
                    key={filter}
                    defaultValue={filter}
                    className="h-8 w-[170px] rounded-[6px] border border-[#4b5563] bg-[#151617] px-3 text-[12px] font-semibold text-zinc-300 outline-none"
                  >
                    <option>{filter}</option>
                  </select>
                ))}
              </div>
            </section>
            <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
              {kpis.map((kpi) => (
                <KPICard key={kpi.title} {...kpi} />
              ))}
            </section>
            <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(560px,1fr)_380px]">
              <TripTable trips={trips} />
              <StatusCard vehicles={vehicles} />
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
