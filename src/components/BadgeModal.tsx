import React from 'react';
import { X, Printer, Shield, CheckCircle, Wifi, AlertTriangle } from 'lucide-react';
import { Visitor } from '../types';
import { formatDateTime, getZoneBadgeConfig } from '../utils/formatters';

interface BadgeModalProps {
  visitor: Visitor | null;
  onClose: () => void;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({ visitor, onClose }) => {
  if (!visitor) return null;

  const zoneConfig = getZoneBadgeConfig(visitor.accessZone);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 no-print">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>Digital Visitor Security Badge</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Badge</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Badge Card Wrapper (For Print & Display) */}
        <div className="p-6 overflow-y-auto flex items-center justify-center bg-slate-950/50">
          <div 
            id="printable-badge"
            className="w-80 bg-white text-slate-900 rounded-2xl shadow-2xl border-2 border-slate-300 overflow-hidden flex flex-col font-sans relative"
          >
            {/* Lanyard Clip Slot Indicator */}
            <div className="w-full flex justify-center pt-2">
              <div className="w-12 h-2.5 rounded-full bg-slate-200 border border-slate-300"></div>
            </div>

            {/* Header Strip with Zone Color */}
            <div className={`p-4 text-center border-b ${visitor.isVip ? 'bg-amber-600 text-white' : 'bg-slate-900 text-white'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] tracking-widest uppercase font-mono font-bold">
                  SENTINEL SECURE ACCESS
                </span>
                <span className="text-[10px] font-mono bg-white/20 px-1.5 py-0.5 rounded">
                  {visitor.badgeNumber}
                </span>
              </div>
              <h2 className="text-xl font-black tracking-tight uppercase">
                {visitor.isVip ? '★ VIP VISITOR PASS ★' : 'OFFICIAL VISITOR PASS'}
              </h2>
            </div>

            {/* Access Zone Ribbon */}
            <div className="bg-slate-100 border-b border-slate-200 px-3 py-1 text-center">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Zone: {visitor.accessZone}
              </span>
            </div>

            {/* Badge Body */}
            <div className="p-5 flex flex-col items-center text-center">
              {/* Visitor Portrait */}
              <div className="relative mb-3">
                <img
                  src={visitor.photoUrl}
                  alt={visitor.fullName}
                  className="w-24 h-24 rounded-xl object-cover border-2 border-slate-300 shadow-sm"
                />
                {visitor.ndaSigned && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow-sm" title="NDA Verified">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Name & Company */}
              <h3 className="text-xl font-bold text-slate-900 leading-tight">
                {visitor.fullName}
              </h3>
              <p className="text-sm font-semibold text-indigo-700 mb-1">
                {visitor.company}
              </p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 mb-3">
                Purpose: {visitor.purpose}
              </span>

              {/* Host & Facility Information */}
              <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-left text-xs mb-3 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Host Employee:</span>
                  <span className="font-semibold text-slate-800">{visitor.hostName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Department:</span>
                  <span className="font-semibold text-slate-700">{visitor.hostDepartment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Issue Time:</span>
                  <span className="font-semibold text-slate-800">
                    {visitor.checkInTime ? formatDateTime(visitor.checkInTime) : 'Pre-Issued'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Valid Until:</span>
                  <span className="font-semibold text-slate-800">{formatDateTime(visitor.expectedCheckOut)}</span>
                </div>
                {visitor.escortRequired && (
                  <div className="pt-1 border-t border-slate-200 flex items-center gap-1 text-rose-600 font-bold text-[11px]">
                    <AlertTriangle className="w-3 h-3" />
                    <span>SECURITY ESCORT MANDATORY</span>
                  </div>
                )}
              </div>

              {/* Simulated QR Code for Scan Gates */}
              <div className="flex items-center justify-between w-full pt-1">
                <div className="flex flex-col items-center">
                  {/* Procedural QR Code Vector */}
                  <svg className="w-16 h-16" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="33" height="33" fill="white"/>
                    {/* Top-Left Corner Box */}
                    <rect x="2" y="2" width="7" height="7" fill="black"/>
                    <rect x="3" y="3" width="5" height="5" fill="white"/>
                    <rect x="4" y="4" width="3" height="3" fill="black"/>
                    {/* Top-Right Corner Box */}
                    <rect x="24" y="2" width="7" height="7" fill="black"/>
                    <rect x="25" y="3" width="5" height="5" fill="white"/>
                    <rect x="26" y="4" width="3" height="3" fill="black"/>
                    {/* Bottom-Left Corner Box */}
                    <rect x="2" y="24" width="7" height="7" fill="black"/>
                    <rect x="3" y="25" width="5" height="5" fill="white"/>
                    <rect x="4" y="26" width="3" height="3" fill="black"/>
                    {/* Matrix pattern elements */}
                    <rect x="11" y="4" width="2" height="2" fill="black"/>
                    <rect x="15" y="2" width="2" height="4" fill="black"/>
                    <rect x="19" y="4" width="2" height="2" fill="black"/>
                    <rect x="11" y="8" width="4" height="2" fill="black"/>
                    <rect x="17" y="8" width="3" height="2" fill="black"/>
                    <rect x="4" y="11" width="3" height="2" fill="black"/>
                    <rect x="9" y="12" width="2" height="2" fill="black"/>
                    <rect x="13" y="12" width="3" height="3" fill="black"/>
                    <rect x="18" y="12" width="2" height="2" fill="black"/>
                    <rect x="22" y="11" width="4" height="2" fill="black"/>
                    <rect x="28" y="13" width="3" height="2" fill="black"/>
                    <rect x="3" y="16" width="4" height="2" fill="black"/>
                    <rect x="9" y="16" width="3" height="2" fill="black"/>
                    <rect x="14" y="17" width="2" height="3" fill="black"/>
                    <rect x="18" y="16" width="3" height="2" fill="black"/>
                    <rect x="23" y="16" width="4" height="2" fill="black"/>
                    <rect x="11" y="21" width="3" height="3" fill="black"/>
                    <rect x="16" y="22" width="2" height="2" fill="black"/>
                    <rect x="20" y="21" width="4" height="2" fill="black"/>
                    <rect x="26" y="21" width="3" height="3" fill="black"/>
                    <rect x="11" y="26" width="2" height="4" fill="black"/>
                    <rect x="15" y="26" width="4" height="2" fill="black"/>
                    <rect x="21" y="25" width="3" height="3" fill="black"/>
                    <rect x="26" y="26" width="3" height="4" fill="black"/>
                  </svg>
                  <span className="text-[8px] font-mono text-slate-500 mt-1">SCAN AT TURNSTILE</span>
                </div>

                <div className="flex flex-col items-end text-right text-[10px] space-y-1 max-w-[140px]">
                  {visitor.wifiAccessGranted && (
                    <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <Wifi className="w-3 h-3" />
                      <span>Wi-Fi: Sentinel-Guest</span>
                    </div>
                  )}
                  <span className="text-slate-500">ID Ref: {visitor.idType} ending ••••{visitor.idNumberLast4}</span>
                  <span className="text-[9px] text-slate-400">Must be visibly worn on outer garment at all times. Return to reception upon exit.</span>
                </div>
              </div>
            </div>

            {/* Bottom Barcode Strip */}
            <div className="bg-slate-900 text-white p-2 flex flex-col items-center">
              <div className="flex gap-[2px] items-center h-5 w-48 justify-center">
                {[2, 4, 1, 3, 2, 5, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 4, 1, 3, 2, 1, 4, 2].map((w, i) => (
                  <div key={i} className="h-full bg-white" style={{ width: `${w}px` }} />
                ))}
              </div>
              <span className="text-[9px] font-mono tracking-widest mt-0.5 text-slate-300">
                *{visitor.badgeNumber}*
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/70 text-center no-print">
          <p className="text-xs text-slate-400">
            Badges can be printed on standard adhesive paper or fed into Zebra/Brother card printers.
          </p>
        </div>
      </div>
    </div>
  );
};
