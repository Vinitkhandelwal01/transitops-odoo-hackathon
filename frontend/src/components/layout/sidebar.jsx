import { LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Fleet', to: '/dashboard' },
  { label: 'Drivers', to: '/dashboard' },
  { label: 'Trips', to: '/dashboard' },
  { label: 'Maintenance', to: '/dashboard' },
  { label: 'Fuel & Expenses', to: '/dashboard' },
  { label: 'Analytics', to: '/dashboard' },
  { label: 'Settings', to: '/settings' },
]

export default function Sidebar() {
  const { logout } = useAuth()

  return (
    <aside className="flex w-full flex-col border-b border-[#9ca3af] bg-[#18191b] px-4 py-5 lg:min-h-[calc(100vh-32px)] lg:w-[178px] lg:border-b-0 lg:border-r">
      <div className="px-2 pb-5">
        <p className="text-[20px] font-bold tracking-[-0.02em] text-zinc-100">TransitOps</p>
      </div>

      <nav className="space-y-4 lg:space-y-5">
        {navItems.map((item) => (
          <NavLink
            key={`${item.label}-${item.to}`}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-[6px] border px-3 py-2 text-[13px] font-semibold transition ${
                (item.label === 'Dashboard' && isActive && item.to === '/dashboard') ||
                (item.label === 'Settings' && isActive)
                  ? 'border-orange-600 bg-orange-600/30 text-white'
                  : 'border-transparent text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/70'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-8">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-[6px] px-2 py-2 text-left text-[12px] font-semibold text-zinc-500 transition hover:bg-zinc-900 hover:text-zinc-100"
        >
          <LogOut className="size-3.5" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
