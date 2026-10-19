import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  Users, 
  Clock, 
  UserPlus, 
  QrCode, 
  Flame, 
  CheckCircle2,
  BellRing
} from 'lucide-react';
import { Visitor, EmergencyEvacuationLog } from '../types';

interface HeaderProps {
  activeTab: 'visitors' | 'kiosk' | 'hosts' | 'emergency' | 'analytics';
  setActiveTab: (tab: 'visitors' | 'kiosk' | 'hosts' | 'emergency' | 'analytics') => void;
  visitors: Visitor[];
  emergencyState: EmergencyEvacuationLog;
  toggleEmergency: () => void;
  onOpenCheckIn: () => void;
  unreadAlertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  visitors,
  emergencyState,
  toggleEmergency,
  onOpenCheckIn,
  unreadAlertsCount,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentlyOnSite = visitors.filter(
    (v) => v.status === 'checked-in' || v.status === 'overstayed'
  ).length;

  const expectedToday = visitors.filter((v) => v.status === 'expected').length;
  const overstayedCount = visitors.filter((v) => v.status === 'overstayed').length;

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      {/* Emergency Alert Banner if Evacuation Active */}
      {emergencyState.active && (
        <div className="bg-rose-600 text-white px-4 py-2 text-center flex items-center justify-center gap-3 animate-pulse font-medium text-sm">
          <Flame className="w-5 h-5 text-amber-300" />
          <span>
            FACILITY EVACUATION IN PROGRESS — ALL VISITORS & STAFF MUST REPORT TO ASSEMBLY POINT B (NORTH LAWN)
          </span>
          <button
            onClick={() => setActiveTab('emergency')}
            className="ml-3 px-3 py-0.5 bg-white text-rose-700 font-semibold rounded text-xs hover:bg-rose-50 transition"
          >
            Open Evacuation Roster
          </button>
        </div>
      )}

      {/* Main Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & System Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">VMS Sentinel</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  HQ Campus
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Visitor & Facility Access Control
              </p>
            </div>
          </div>

          {/* Center Stats Ticker */}
          <div className="hidden md:flex items-center gap-6 px-4 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-400">On-Site:</span>
              <span className="font-semibold text-white">{currentlyOnSite}</span>
            </div>

            <div className="h-3 w-px bg-slate-800" />

            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-400">Expected:</span>
              <span className="font-semibold text-blue-300">{expectedToday}</span>
            </div>

            {overstayedCount > 0 && (
              <>
                <div className="h-3 w-px bg-slate-800" />
                <div className="flex items-center gap-1.5 text-rose-400 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{overstayedCount} Overstay</span>
                </div>
              </>
            )}

            <div className="h-3 w-px bg-slate-800" />

            <div className="text-slate-400 font-mono">
              <span className="text-slate-200 font-medium">{currentTime}</span>
              <span className="ml-1.5 text-[11px] text-slate-500">{currentDate}</span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleEmergency}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
                emergencyState.active
                  ? 'bg-rose-600 border-rose-500 text-white hover:bg-rose-700'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-rose-400 hover:border-rose-500/40'
              }`}
              title="Toggle facility emergency drill"
            >
              <Flame className={`w-3.5 h-3.5 ${emergencyState.active ? 'text-amber-300 animate-bounce' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">
                {emergencyState.active ? 'Stop Evac Drill' : 'Emergency Drill'}
              </span>
            </button>

            <button
              onClick={onOpenCheckIn}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 border border-indigo-500/40 transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Check In Visitor</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 text-sm">
          <button
            onClick={() => setActiveTab('visitors')}
            className={`px-3.5 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'visitors'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Visitor Log & Operations</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
              {visitors.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('kiosk')}
            className={`px-3.5 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'kiosk'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Self-Service Kiosk Mode</span>
          </button>

          <button
            onClick={() => setActiveTab('hosts')}
            className={`px-3.5 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'hosts'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Staff Directory & Alerts</span>
            {unreadAlertsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-500 text-[10px] text-white">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('emergency')}
            className={`px-3.5 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'emergency'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Evacuation Roster</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
              {currentlyOnSite} on-site
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Compliance & Analytics</span>
          </button>
        </div>
      </div>
    </header>
  );
};
