import React from 'react';

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight text-zinc-100">Analytics & Reports</h1>
          <p className="text-[12px] text-zinc-400">Review vehicle utilization, cost trends, and driver safety reports</p>
        </div>
        <div className="flex gap-2">
          <button className="h-8 rounded-[6px] border border-[#4b5563] bg-[#151617] px-3 text-[12px] font-semibold text-zinc-300">
            Export CSV
          </button>
          <button className="h-8 rounded-[6px] border border-[#4b5563] bg-[#151617] px-3 text-[12px] font-semibold text-zinc-300">
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Total Distance', value: '14,240 km', change: '+12.5% this month', positive: true },
          { label: 'Fuel Consumed', value: '1,840 L', change: '-4.2% from target', positive: true },
          { label: 'Active Alerts', value: '3 Warnings', change: 'Require attention', positive: false },
        ].map((stat, i) => (
          <div key={i} className="rounded-[8px] border border-[#242526] bg-[#151617] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">{stat.label}</p>
            <p className="mt-1 text-[24px] font-bold text-zinc-100">{stat.value}</p>
            <p className={`mt-2 text-[11px] ${stat.positive ? 'text-green-500' : 'text-orange-500'}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-[8px] border border-[#242526] bg-[#151617] p-6">
        <h2 className="text-[14px] font-bold text-zinc-200">Fuel & Cost Analytics</h2>
        <div className="mt-6 h-48 flex items-end gap-2 border-b border-[#242526] pb-2">
          {[45, 60, 55, 70, 65, 80, 95, 85, 75, 90, 85, 100].map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-sky-500/80 hover:bg-sky-400 rounded-t-[2px] transition-all" 
                style={{ height: `${val * 1.2}px` }}
              ></div>
              <span className="text-[9px] text-zinc-500">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[12px] text-zinc-400 text-center">
          Monthly operating costs in thousand INR (Rs.).
        </p>
      </div>
    </div>
  );
}
