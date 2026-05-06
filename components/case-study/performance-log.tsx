"use client";

import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface PerformanceLogProps {
  performance: any[];
}

export function PerformanceLog({ performance }: PerformanceLogProps) {
  return (
    <div className="mb-32">
      <div className="flex items-center gap-3 mb-8 px-4">
        <div className="h-2 w-2 rounded-full bg-cyan-400" />
        <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-white/30">Monthly Performance Log</h3>
      </div>

      {/* Performance Chart */}
      <div className="mb-10 p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={performance?.map((p: any) => ({
              name: p.month,
              balance: parseFloat(p.balance.replace(/[\$,]/g, '')),
              originalBalance: p.balance
            }))}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#ffffff30', fontSize: 10, fontWeight: 'bold' }} 
              dy={10}
            />
            <YAxis hide />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-black/90 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{payload[0].payload.name}</p>
                      <p className="text-lg font-bold text-white">{payload[0].payload.originalBalance}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="#22d3ee" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorBalance)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.03]">
                <th className="px-8 py-5 text-[10px] font-bold text-white/40 uppercase tracking-widest">Month</th>
                <th className="px-8 py-5 text-[10px] font-bold text-white/40 uppercase tracking-widest">Investment Plan</th>
                <th className="px-8 py-5 text-[10px] font-bold text-white/40 uppercase tracking-widest">Capital Deployed</th>
                <th className="px-8 py-5 text-[10px] font-bold text-white/40 uppercase tracking-widest">Monthly Profit</th>
                <th className="px-8 py-5 text-[10px] font-bold text-white/40 uppercase tracking-widest text-right">Month-End Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {performance?.map((perf: any, idx: number) => (
                <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-white">{perf.month}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      perf.plan === 'Aggressive' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                      perf.plan === 'Risk Guard' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                      'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                    }`}>
                      {perf.plan}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm text-white/60 font-medium">{perf.capital}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-emerald-400">{perf.profit}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-sm font-bold text-white">{perf.balance}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-6 px-4 text-[10px] text-white/20 italic">
        * All figures are audited and represent real autonomous trading results within the defined strategy parameters.
      </p>
    </div>
  );
}
