import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  UserCheck, 
  LogOut, 
  Eye, 
  Bell, 
  Clock, 
  Building2, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  QrCode,
  Sparkles,
  Calendar
} from 'lucide-react';
import { Visitor, VisitorStatus, AccessZone, VisitPurpose } from '../types';
import { 
  formatDateTime, 
  formatTimeOnly, 
  getDurationString, 
  getStatusBadgeConfig, 
  getZoneBadgeConfig,
  exportVisitorsToCSV
} from '../utils/formatters';

interface VisitorLogViewProps {
  visitors: Visitor[];
  onCheckOut: (id: string) => void;
  onCheckInExpected: (id: string) => void;
  onViewBadge: (visitor: Visitor) => void;
  onResendAlert: (visitor: Visitor) => void;
  onOpenCheckIn: (mode?: 'immediate' | 'preregister') => void;
  onSelectVisitorDetails: (visitor: Visitor) => void;
}

export const VisitorLogView: React.FC<VisitorLogViewProps> = ({
  visitors,
  onCheckOut,
  onCheckInExpected,
  onViewBadge,
  onResendAlert,
  onOpenCheckIn,
  onSelectVisitorDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('all');

  // Filter logic
  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.fullName.toLowerCase().includes(q) ||
        v.company.toLowerCase().includes(q) ||
        v.badgeNumber.toLowerCase().includes(q) ||
        v.hostName.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q);

      // Status Tab
      const matchesStatus =
        selectedStatusTab === 'all' || v.status === selectedStatusTab;

      // Zone filter
      const matchesZone =
        selectedZone === 'all' || v.accessZone === selectedZone;

      // Purpose filter
      const matchesPurpose =
        selectedPurpose === 'all' || v.purpose === selectedPurpose;

      return matchesSearch && matchesStatus && matchesZone && matchesPurpose;
    });
  }, [visitors, searchQuery, selectedStatusTab, selectedZone, selectedPurpose]);

  const countByStatus = useMemo(() => {
    return {
      all: visitors.length,
      'checked-in': visitors.filter((v) => v.status === 'checked-in').length,
      expected: visitors.filter((v) => v.status === 'expected').length,
      overstayed: visitors.filter((v) => v.status === 'overstayed').length,
      'checked-out': visitors.filter((v) => v.status === 'checked-out').length,
    };
  }, [visitors]);

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by visitor name, company, host, or badge #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => exportVisitorsToCSV(filteredVisitors)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition"
              title="Export filtered records to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => onOpenCheckIn('preregister')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-xl text-xs font-medium flex items-center gap-1.5 border border-indigo-500/30 transition"
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Pre-Register Guest</span>
            </button>

            <button
              onClick={() => onOpenCheckIn('immediate')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 border border-indigo-500/40 transition"
            >
              <UserCheck className="w-4 h-4" />
              <span>Check In Visitor</span>
            </button>
          </div>
        </div>

        {/* Status Tab Navigation & Dropdowns */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-medium">
            {[
              { id: 'all', label: 'All Visitors', count: countByStatus.all },
              { id: 'checked-in', label: 'Checked In', count: countByStatus['checked-in'], dot: 'bg-emerald-400' },
              { id: 'expected', label: 'Expected', count: countByStatus.expected, dot: 'bg-blue-400' },
              { id: 'overstayed', label: 'Overstayed', count: countByStatus.overstayed, dot: 'bg-rose-400' },
              { id: 'checked-out', label: 'Checked Out', count: countByStatus['checked-out'], dot: 'bg-slate-400' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatusTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition whitespace-nowrap ${
                  selectedStatusTab === tab.id
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.dot && <span className={`w-1.5 h-1.5 rounded-full ${tab.dot}`} />}
                <span>{tab.label}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-[10px] text-slate-400 border border-slate-800">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Secondary Filters */}
          <div className="flex items-center gap-2">
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Zones</option>
              <option value="Lobby & Reception">Lobby & Reception</option>
              <option value="Floor 1-3 General Office">Floor 1-3 General</option>
              <option value="Floor 4 Executive Suites">Floor 4 Executive</option>
              <option value="R&D Innovation Lab">R&D Lab</option>
              <option value="Data Center (Escort Only)">Data Center (Escort)</option>
            </select>

            <select
              value={selectedPurpose}
              onChange={(e) => setSelectedPurpose(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Purposes</option>
              <option value="Business Meeting">Business Meeting</option>
              <option value="Job Interview">Job Interview</option>
              <option value="Client Demo">Client Demo</option>
              <option value="Vendor / Delivery">Vendor / Delivery</option>
              <option value="Contractor Work">Contractor Work</option>
              <option value="Facility Maintenance">Maintenance</option>
              <option value="Executive / Board">Executive / Board</option>
              <option value="VIP Tour">VIP Tour</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visitor Records Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Visitor & Badge</th>
                <th className="py-3.5 px-4">Host Employee</th>
                <th className="py-3.5 px-4">Access Zone & Purpose</th>
                <th className="py-3.5 px-4">Time & Duration</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p className="text-sm font-medium text-slate-400">No visitors found</p>
                    <p className="text-xs text-slate-500">
                      Try adjusting your search criteria or register a new visitor.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredVisitors.map((v) => {
                  const statusConfig = getStatusBadgeConfig(v.status);
                  const zoneConfig = getZoneBadgeConfig(v.accessZone);

                  return (
                    <tr
                      key={v.id}
                      className="hover:bg-slate-800/40 transition group"
                    >
                      {/* Visitor Name & Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={v.photoUrl}
                              alt={v.fullName}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow-sm"
                            />
                            {v.isVip && (
                              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-extrabold px-1 rounded-full shadow" title="VIP Guest">
                                VIP
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span 
                                onClick={() => onSelectVisitorDetails(v)}
                                className="font-semibold text-white hover:text-indigo-400 cursor-pointer transition text-sm"
                              >
                                {v.fullName}
                              </span>
                              {v.ndaSigned && (
                                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20" title="NDA Signed">
                                  NDA
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 text-[11px] flex items-center gap-2 mt-0.5">
                              <span>{v.company}</span>
                              <span className="text-slate-600">•</span>
                              <button
                                onClick={() => onViewBadge(v)}
                                className="font-mono text-indigo-400 hover:underline flex items-center gap-1"
                              >
                                <QrCode className="w-2.5 h-2.5" />
                                {v.badgeNumber}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Host */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200">{v.hostName}</div>
                        <div className="text-[11px] text-slate-400">{v.hostDepartment}</div>
                      </td>

                      {/* Zone & Purpose */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium border ${zoneConfig.border} ${zoneConfig.bg}`}
                          >
                            {v.accessZone}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {v.purpose}
                            {v.escortRequired && (
                              <span className="ml-1.5 text-rose-400 font-semibold text-[10px]">
                                [Escort Req]
                              </span>
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Time & Duration */}
                      <td className="py-3 px-4">
                        {v.status === 'expected' ? (
                          <div className="text-slate-400 text-[11px]">
                            <span>Expected: </span>
                            <span className="text-slate-200 font-medium">{formatTimeOnly(v.expectedCheckIn)}</span>
                          </div>
                        ) : (
                          <div>
                            <div className="text-slate-200 font-medium">
                              {formatTimeOnly(v.checkInTime)}
                              {v.checkOutTime && (
                                <span className="text-slate-400 text-[11px]"> → {formatTimeOnly(v.checkOutTime)}</span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>{getDurationString(v.checkInTime, v.checkOutTime)}</span>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${statusConfig.bg} ${statusConfig.text}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                          {statusConfig.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {v.status === 'expected' && (
                            <button
                              onClick={() => onCheckInExpected(v.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition"
                              title="Check In Guest Now"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>Check In</span>
                            </button>
                          )}

                          {(v.status === 'checked-in' || v.status === 'overstayed') && (
                            <button
                              onClick={() => onCheckOut(v.id)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 hover:border-rose-500/30 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700 transition"
                              title="Check Out Visitor"
                            >
                              <LogOut className="w-3 h-3 text-rose-400" />
                              <span>Check Out</span>
                            </button>
                          )}

                          <button
                            onClick={() => onViewBadge(v)}
                            className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition"
                            title="View / Print Digital Badge"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onResendAlert(v)}
                            className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition"
                            title="Resend Host Notification"
                          >
                            <Bell className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onSelectVisitorDetails(v)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                            title="Visitor Details & Audit Trail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Summary Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <span className="font-semibold text-slate-200">{filteredVisitors.length}</span> of{' '}
            <span className="font-semibold text-slate-200">{visitors.length}</span> total records
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Active: {countByStatus['checked-in']}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Expected: {countByStatus.expected}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
