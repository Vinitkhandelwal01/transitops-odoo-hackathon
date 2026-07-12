import Sidebar from './sidebar.jsx'
import Navbar from './navbar.jsx'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#121212] p-1 text-zinc-100 md:p-2">
      <div className="min-h-[calc(100vh-16px)] border-2 border-[#9ca3af] bg-[#101010] lg:grid lg:grid-cols-[178px_1fr]">
        <Sidebar />
        <main className="min-w-0">
          <Navbar />
          <div className="px-4 py-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
