import React, { useState } from 'react';
import { 
  Flame, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Printer, 
  Send, 
  Phone, 
  Building2, 
  UserCheck, 
  Radio,
  FileSpreadsheet
} from 'lucide-react';
import { Visitor, EmergencyEvacuationLog } from '../types';
import { formatTimeOnly, getZoneBadgeConfig } from '../utils/formatters';

interface EmergencyRosterViewProps {
  visitors: Visitor[];
  emergencyState: EmergencyEvacuationLog;
  toggleEmergency: () => void;
  onToggleAccountedFor: (visitorId: string) => void;
  onMarkAllAccounted: () => void;
}

export const EmergencyRosterView: React.FC<EmergencyRosterViewProps> = ({
  visitors,
  emergencyState,
  toggleEmergency,
  onToggleAccountedFor,
  onMarkAllAccounted,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'unaccounted' | 'safe'>('all');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Active visitors currently inside
  const activeVisitors = visitors.filter(
    (v) => v.status === 'checked-in' || v.status === 'overstayed'
  );

  const accountedCount = activeVisitors.filter((v) => v.accountedForInEmergency).length;
  const totalOnSite = activeVisitors.length;
  const percentAccounted = totalOnSite > 0 ? Math.round((accountedCount / totalOnSite) * 100) : 100;

  const displayList = activeVisitors.filter((v) => {
    if (filterMode === 'unaccounted') return !v.accountedForInEmergency;
    if (filterMode === 'safe') return !!v.accountedForInEmergency;
    return true;
  });

  const handleSendBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 5000);
  };

  const handlePrintRoster = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Emergency Status Banner */}
      <div
        className={`p-6 rounded-2xl border transition shadow-xl ${
          emergencyState.active
            ? 'bg-rose-950/40 border-rose-500/50'
            : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-2xl border ${
                emergencyState.active
                  ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <Flame className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  {emergencyState.active
                    ? 'EMERGENCY EVACUATION ACTIVE'
                    : 'Facility Muster & Evacuation Control'}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    emergencyState.active
                      ? 'bg-rose-500 text-white'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {emergencyState.active ? 'ALARM LEVEL 3' : 'NORMAL STATUS'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Real-time head-count roll call for safety wardens and first responders. Assembly Point: <strong className="text-slate-200">North Lawn Muster Station B</strong>.
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handlePrintRoster}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Fire Roster</span>
            </button>

            <button
              onClick={handleSendBroadcast}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Broadcast Evac SMS</span>
            </button>

            <button
              onClick={toggleEmergency}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-md ${
                emergencyState.active
                  ? 'bg-white text-rose-700 hover:bg-rose-50'
                  : 'bg-rose-600 hover:bg-rose-500 text-white'
              }`}
            >
              {emergencyState.active ? 'End Evacuation Drill' : 'Declare Evac Drill'}
            </button>
          </div>
        </div>

        {/* Broadcast Toast Notification */}
        {broadcastSent && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2 animate-fadeIn">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            <span>
              Emergency broadcast sent to all {totalOnSite} on-site visitor mobile numbers: <em>"Emergency evacuation in effect. Please evacuate via nearest exit to Assembly Point B."</em>
            </span>
          </div>
        )}

        {/* Progress Tracker */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">Muster Roll Accountability</span>
            <span className="font-bold text-white">
              {accountedCount} of {totalOnSite} Visitors Accounted For ({percentAccounted}%)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                accountedCount === totalOnSite && totalOnSite > 0
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-amber-500 to-indigo-500'
              }`}
              style={{ width: `${percentAccounted}%` }}
            />
          </div>
        </div>
      </div>

      {/* Roster Table Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filterMode === 'all'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All On-Site ({totalOnSite})
            </button>
            <button
              onClick={() => setFilterMode('unaccounted')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filterMode === 'unaccounted'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Unaccounted ({totalOnSite - accountedCount})
            </button>
            <button
              onClick={() => setFilterMode('safe')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filterMode === 'safe'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Marked Safe ({accountedCount})
            </button>
          </div>

          <button
            onClick={onMarkAllAccounted}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg border border-slate-700 transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mark All As Accounted</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Accountability</th>
                <th className="py-3 px-4">Visitor & Company</th>
                <th className="py-3 px-4">Host Employee</th>
                <th className="py-3 px-4">Assigned Area</th>
                <th className="py-3 px-4">Check-In Time</th>
                <th className="py-3 px-4 text-right">Emergency Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {displayList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                    <p className="text-sm font-medium text-slate-400">
                      {totalOnSite === 0
                        ? 'No active visitors currently in the building'
                        : 'All visitors in this view have been accounted for'}
                    </p>
                  </td>
                </tr>
              ) : (
                displayList.map((v) => {
                  const isAccounted = !!v.accountedForInEmergency;
                  const zoneConfig = getZoneBadgeConfig(v.accessZone);

                  return (
                    <tr
                      key={v.id}
                      className={`hover:bg-slate-800/30 transition ${
                        isAccounted ? 'opacity-70 bg-emerald-950/10' : 'bg-rose-950/10'
                      }`}
                    >
                      {/* Checkbox Roll-Call */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => onToggleAccountedFor(v.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
                            isAccounted
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-600 hover:text-white'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isAccounted ? 'Safe / Present' : 'Mark Accounted'}</span>
                        </button>
                      </td>

                      {/* Visitor */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{v.fullName}</div>
                        <div className="text-[11px] text-slate-400">
                          {v.company} • <span className="font-mono text-indigo-400">{v.badgeNumber}</span>
                        </div>
                      </td>

                      {/* Host */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200">{v.hostName}</div>
                        <div className="text-[11px] text-slate-400">{v.hostDepartment}</div>
                      </td>

                      {/* Zone */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-medium border ${zoneConfig.border} ${zoneConfig.bg}`}
                        >
                          {v.accessZone}
                        </span>
                      </td>

                      {/* Time */}
                      <td className="py-3 px-4">
                        <div className="text-slate-200 font-medium">
                          {formatTimeOnly(v.checkInTime)}
                        </div>
                        <div className="text-[10px] text-slate-500">Today</div>
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-4 text-right">
                        <a
                          href={`tel:${v.phone}`}
                          className="inline-flex items-center gap-1.5 font-mono text-indigo-400 hover:underline text-xs"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{v.phone}</span>
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
