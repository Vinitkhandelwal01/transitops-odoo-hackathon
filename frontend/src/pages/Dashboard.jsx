import { useEffect, useState } from 'react'
import KPICard from '../components/dashboard/KPICard.jsx'
import StatusCard from '../components/dashboard/StatusCard.jsx'
import TripTable from '../components/dashboard/TripTable.jsx'
import Navbar from '../components/layout/navbar.jsx'
import Sidebar from '../components/layout/sidebar.jsx'
import { dashboardApi } from '../services/api.js'

const toneForKpi = (title) => {
  if (title === 'Available Vehicles' || title === 'Fleet Utilization') return 'green'
  if (title === 'Vehicles In Maintenance') return 'orange'
  return 'blue'
}

const statusWidthClass = {
  Available: 'available',
  'On Trip': 'on-trip',
  'In Shop': 'in-shop',
  Retired: 'retired',
}

export default function Dashboard() {
  const [kpis, setKpis] = useState([])
  const [trips, setTrips] = useState([])
  const [vehicleStatus, setVehicleStatus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      setError('')

      try {
        const [kpiRes, tripsRes, statusRes] = await Promise.all([
          dashboardApi.getKpis(),
          dashboardApi.getRecentTrips(),
          dashboardApi.getVehicleStatus(),
        ])

        const k = kpiRes.data
        setKpis([
          { title: 'Active Vehicles', value: String(k.activeVehicles), tone: toneForKpi('Active Vehicles') },
          { title: 'Available Vehicles', value: String(k.availableVehicles), tone: toneForKpi('Available Vehicles') },
          { title: 'Vehicles In Maintenance', value: String(k.vehiclesInMaintenance), tone: toneForKpi('Vehicles In Maintenance') },
          { title: 'Active Trips', value: String(k.activeTrips), tone: toneForKpi('Active Trips') },
          { title: 'Pending Trips', value: String(k.pendingTrips), tone: toneForKpi('Pending Trips') },
          { title: 'Drivers On Duty', value: String(k.driversOnDuty), tone: toneForKpi('Drivers On Duty') },
          { title: 'Fleet Utilization', value: `${k.fleetUtilization}%`, tone: toneForKpi('Fleet Utilization') },
        ])

        setTrips(tripsRes.data)

        setVehicleStatus(
          statusRes.data.breakdown.map((item) => ({
            label: item.label,
            percent: item.percent,
          })),
        )
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

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

            {error ? (
              <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            {loading ? (
              <div className="mt-6 text-sm text-zinc-500">Loading dashboard...</div>
            ) : (
              <>
                <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                  {kpis.map((kpi) => (
                    <KPICard key={kpi.title} {...kpi} />
                  ))}
                </section>
                <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(560px,1fr)_380px]">
                  <TripTable trips={trips} />
                  <StatusCard vehicles={vehicleStatus} />
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
