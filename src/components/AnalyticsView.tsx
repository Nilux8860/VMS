import React from 'react';
import { 
  Users, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Building, 
  FileCheck, 
  AlertCircle,
  BarChart3,
  CalendarDays
} from 'lucide-react';
import { Visitor, Host } from '../types';

interface AnalyticsViewProps {
  visitors: Visitor[];
  hosts: Host[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ visitors, hosts }) => {
  const totalVisitors = visitors.length;
  const currentlyOnSite = visitors.filter(
    (v) => v.status === 'checked-in' || v.status === 'overstayed'
  ).length;
  const checkedOutCount = visitors.filter((v) => v.status === 'checked-out').length;
  const expectedCount = visitors.filter((v) => v.status === 'expected').length;
  const overstayedCount = visitors.filter((v) => v.status === 'overstayed').length;
  
  const ndaCompliantCount = visitors.filter((v) => v.ndaSigned).length;
  const complianceRate = totalVisitors > 0 ? Math.round((ndaCompliantCount / totalVisitors) * 100) : 100;

  // Purpose breakdown
  const purposeMap: Record<string, number> = {};
  visitors.forEach((v) => {
    purposeMap[v.purpose] = (purposeMap[v.purpose] || 0) + 1;
  });

  // Department breakdown
  const deptMap: Record<string, number> = {};
  visitors.forEach((v) => {
    deptMap[v.hostDepartment] = (deptMap[v.hostDepartment] || 0) + 1;
  });

  // Hourly traffic mockup bars
  const hourlyData = [
    { hour: '08:00', count: 2 },
    { hour: '09:00', count: 5 },
    { hour: '10:00', count: 8 },
    { hour: '11:00', count: 6 },
    { hour: '12:00', count: 3 },
    { hour: '13:00', count: 7 },
    { hour: '14:00', count: 9 },
    { hour: '15:00', count: 4 },
    { hour: '16:00', count: 2 },
  ];
  const maxHourly = Math.max(...hourlyData.map((d) => d.count));

  return (
    <div className="space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Processed Today</span>
            <h4 className="text-2xl font-bold text-white mt-0.5">{totalVisitors}</h4>
            <span className="text-[11px] text-emerald-400 font-medium">↑ 14% vs yesterday</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Currently In Facility</span>
            <h4 className="text-2xl font-bold text-white mt-0.5">{currentlyOnSite}</h4>
            <span className="text-[11px] text-slate-400 font-medium">Active badges</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Avg Visit Duration</span>
            <h4 className="text-2xl font-bold text-white mt-0.5">2h 15m</h4>
            <span className="text-[11px] text-slate-400 font-medium">Typical dwell time</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">NDA Compliance Rate</span>
            <h4 className="text-2xl font-bold text-white mt-0.5">{complianceRate}%</h4>
            <span className="text-[11px] text-emerald-400 font-medium">Audit ready</span>
          </div>
        </div>
      </div>

      {/* Charts & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Traffic Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-white">Daily Check-In Hourly Volume</h3>
              <p className="text-xs text-slate-400">Peak visitor influx analysis across the day</p>
            </div>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
              Peak: 2:00 PM
            </span>
          </div>

          <div className="h-48 flex items-end gap-2.5 sm:gap-4 pt-4 border-b border-slate-800 pb-2">
            {hourlyData.map((d, i) => {
              const heightPercent = Math.round((d.count / maxHourly) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition">
                    {d.count}
                  </span>
                  <div
                    className="w-full bg-indigo-600/60 hover:bg-indigo-500 rounded-t-md transition-all group-hover:shadow-lg group-hover:shadow-indigo-500/30"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] text-slate-500 font-mono rotate-45 sm:rotate-0 mt-1">
                    {d.hour}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Morning Shift: 08:00 - 12:00</span>
            <span>Afternoon Influx: 13:00 - 17:00</span>
          </div>
        </div>

        {/* Visit Purpose Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-white">Visit Category Distribution</h3>
              <p className="text-xs text-slate-400">Classification of on-campus guest visits</p>
            </div>
            <BarChart3 className="w-4 h-4 text-slate-500" />
          </div>

          <div className="space-y-3.5">
            {Object.entries(purposeMap).map(([purpose, count]) => {
              const pct = totalVisitors > 0 ? Math.round((count / totalVisitors) * 100) : 0;
              return (
                <div key={purpose} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{purpose}</span>
                    <span className="text-slate-400 font-mono">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Department Breakdown & Security Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-semibold text-white mb-1">Host Department Traffic</h3>
          <p className="text-xs text-slate-400 mb-4">Volume of guests received by internal business units</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(deptMap).map(([dept, count]) => (
              <div
                key={dept}
                className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-200 block">{dept}</span>
                  <span className="text-slate-500 text-[11px]">Authorized Hosts Active</span>
                </div>
                <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                  {count} guests
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Policy Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-semibold text-white">Facility Security Policy</h3>
          
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Badge Printing: Enforced</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Digital NDA Sign-Off: Required</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Automated Host Dispatch: Active</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Overstay Threshold: 4 Hours Max</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Data Center Escort Policy: Strict</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
