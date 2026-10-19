import React from 'react';
import { 
  X, 
  User, 
  Building, 
  Mail, 
  Phone, 
  Car, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  QrCode, 
  LogOut, 
  UserCheck, 
  Trash2, 
  Wifi, 
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { Visitor } from '../types';
import { formatDateTime, getDurationString, getStatusBadgeConfig, getZoneBadgeConfig } from '../utils/formatters';

interface VisitorDetailModalProps {
  visitor: Visitor | null;
  onClose: () => void;
  onViewBadge: (v: Visitor) => void;
  onToggleStatus: (visitorId: string) => void;
  onDelete: (visitorId: string) => void;
}

export const VisitorDetailModal: React.FC<VisitorDetailModalProps> = ({
  visitor,
  onClose,
  onViewBadge,
  onToggleStatus,
  onDelete,
}) => {
  if (!visitor) return null;

  const statusConfig = getStatusBadgeConfig(visitor.status);
  const zoneConfig = getZoneBadgeConfig(visitor.accessZone);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-bold">
              {visitor.badgeNumber}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
              {statusConfig.label}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Identity Header */}
          <div className="flex items-center gap-4">
            <img
              src={visitor.photoUrl}
              alt={visitor.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{visitor.fullName}</h3>
                {visitor.isVip && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500 text-slate-950">
                    VIP
                  </span>
                )}
              </div>
              <p className="text-xs text-indigo-400 font-semibold">{visitor.company}</p>
              <p className="text-xs text-slate-400 mt-0.5">Purpose: {visitor.purpose}</p>
            </div>
          </div>

          {/* Timing & Dwell Duration */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block">Check-In Time</span>
              <span className="font-semibold text-slate-200">
                {visitor.checkInTime ? formatDateTime(visitor.checkInTime) : 'Pending arrival'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Check-Out Time</span>
              <span className="font-semibold text-slate-200">
                {visitor.checkOutTime ? formatDateTime(visitor.checkOutTime) : 'Still on-site'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Stay Duration</span>
              <span className="font-semibold text-indigo-300">
                {getDurationString(visitor.checkInTime, visitor.checkOutTime)}
              </span>
            </div>
          </div>

          {/* Host & Zone Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Host & Facility Access
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/40 border border-slate-800 p-3 rounded-xl space-y-1">
                <span className="text-slate-500 block">Host Employee</span>
                <span className="font-semibold text-white block">{visitor.hostName}</span>
                <span className="text-slate-400 block">{visitor.hostDepartment}</span>
              </div>

              <div className="bg-slate-950/40 border border-slate-800 p-3 rounded-xl space-y-1">
                <span className="text-slate-500 block">Access Zone Clearance</span>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${zoneConfig.border} ${zoneConfig.bg}`}
                >
                  {visitor.accessZone}
                </span>
                {visitor.escortRequired && (
                  <span className="text-rose-400 font-bold block text-[10px]">
                    Requires continuous escort
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Verification & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Compliance & Security Checks
            </h4>
            <div className="bg-slate-950/40 border border-slate-800 p-3.5 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">ID Verification:</span>
                <span className="text-slate-200 font-mono">
                  {visitor.idType} ending ••••{visitor.idNumberLast4}
                </span>
              </div>

              {visitor.vehiclePlate && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Registered Vehicle Plate:</span>
                  <span className="text-slate-200 font-mono font-semibold">
                    {visitor.vehiclePlate}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-400">NDA Status:</span>
                <span className={visitor.ndaSigned ? 'text-emerald-400 font-medium' : 'text-rose-400'}>
                  {visitor.ndaSigned ? 'Signed & Stored on File' : 'Not signed'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Safety & Fire Briefing:</span>
                <span className={visitor.safetyBriefingAcknowledged ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
                  {visitor.safetyBriefingAcknowledged ? 'Acknowledged' : 'Pending'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Guest Wi-Fi Access:</span>
                <span className={visitor.wifiAccessGranted ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
                  {visitor.wifiAccessGranted ? 'Active (Sentinel-Guest)' : 'Disabled'}
                </span>
              </div>

              {visitor.notes && (
                <div className="pt-2 border-t border-slate-800 text-slate-400">
                  <span className="block text-slate-500 mb-0.5">Notes:</span>
                  <p className="italic text-slate-300">{visitor.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between gap-3">
          <button
            onClick={() => onDelete(visitor.id)}
            className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
            title="Delete record from system"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewBadge(visitor)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Digital Badge</span>
            </button>

            {(visitor.status === 'checked-in' || visitor.status === 'overstayed') ? (
              <button
                onClick={() => onToggleStatus(visitor.id)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Check Out</span>
              </button>
            ) : visitor.status === 'expected' ? (
              <button
                onClick={() => onToggleStatus(visitor.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Check In Now</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
