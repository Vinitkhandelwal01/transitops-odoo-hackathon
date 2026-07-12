import { Search } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="flex h-[52px] items-center justify-between border-b border-[#9ca3af] bg-[#111112] px-4">
      <div className="relative w-full max-w-[250px] md:max-w-[310px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-zinc-500" />
        <input
          type="search"
          placeholder="Search..."
          className="h-7 w-full rounded-[6px] border border-[#4b5563] bg-[#151617] pl-9 pr-3 text-[12px] font-medium text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-sky-500"
        />
      </div>

      <div className="ml-3 flex items-center gap-3 text-[11px] font-semibold text-zinc-300">
        <span className="hidden sm:inline">Raven K.</span>
        <span className="rounded-[5px] border border-sky-500 bg-sky-500/10 px-2 py-1 text-[10px] text-sky-300">
          Dispatcher
        </span>
        <span className="grid size-7 place-items-center rounded-full border border-sky-300 bg-sky-500/30 text-[10px] text-white">
          RK
        </span>
      </div>
    </header>
  )
}
