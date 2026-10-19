import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Calendar, 
  Building, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  ShieldCheck, 
  Camera, 
  CheckCircle2, 
  Car,
  Wifi,
  Sparkles
} from 'lucide-react';
import { Host, Visitor, VisitPurpose, AccessZone } from '../types';
import { generateBadgeNumber } from '../utils/formatters';

interface CheckInModalProps {
  hosts: Host[];
  onClose: () => void;
  onSaveVisitor: (visitor: Visitor, notifyHost: boolean) => void;
  initialMode?: 'immediate' | 'preregister';
}

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&h=256&q=80',
];

export const CheckInModal: React.FC<CheckInModalProps> = ({
  hosts,
  onClose,
  onSaveVisitor,
  initialMode = 'immediate',
}) => {
  const [mode, setMode] = useState<'immediate' | 'preregister'>(initialMode);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [hostId, setHostId] = useState(hosts[0]?.id || '');
  const [purpose, setPurpose] = useState<VisitPurpose>('Business Meeting');
  const [accessZone, setAccessZone] = useState<AccessZone>('Floor 1-3 General Office');
  
  const [idType, setIdType] = useState<'Driver License' | 'Passport' | 'Government ID' | 'Corporate Badge'>('Driver License');
  const [idNumberLast4, setIdNumberLast4] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [notes, setNotes] = useState('');
  
  const [photoUrl, setPhotoUrl] = useState(SAMPLE_AVATARS[0]);
  const [ndaSigned, setNdaSigned] = useState(true);
  const [safetyBriefingAcknowledged, setSafetyBriefingAcknowledged] = useState(true);
  const [wifiAccessGranted, setWifiAccessGranted] = useState(true);
  const [isVip, setIsVip] = useState(false);
  const [escortRequired, setEscortRequired] = useState(false);

  // Time selections
  const [expectedDurationHours, setExpectedDurationHours] = useState('2');

  const selectedHost = hosts.find((h) => h.id === hostId) || hosts[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !company.trim()) return;

    const now = new Date();
    const durationMs = parseInt(expectedDurationHours, 10) * 3600 * 1000;
    const checkoutTime = new Date(now.getTime() + durationMs).toISOString();

    const newVisitor: Visitor = {
      id: `vis-${Date.now()}`,
      badgeNumber: generateBadgeNumber(),
      fullName: fullName.trim(),
      email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: phone.trim() || '+1 (555) 000-0000',
      company: company.trim(),
      hostId: selectedHost.id,
      hostName: selectedHost.name,
      hostDepartment: selectedHost.department,
      purpose,
      status: mode === 'immediate' ? 'checked-in' : 'expected',
      checkInTime: mode === 'immediate' ? now.toISOString() : undefined,
      expectedCheckIn: mode === 'immediate' ? now.toISOString() : new Date(now.getTime() + 3600 * 1000).toISOString(),
      expectedCheckOut: checkoutTime,
      accessZone,
      photoUrl,
      ndaSigned,
      ndaSignedAt: ndaSigned ? now.toISOString() : undefined,
      idType,
      idNumberLast4: idNumberLast4.trim() || Math.floor(1000 + Math.random() * 9000).toString(),
      vehiclePlate: vehiclePlate.trim() || undefined,
      notes: notes.trim() || undefined,
      isVip,
      escortRequired: escortRequired || accessZone.includes('Escort'),
      safetyBriefingAcknowledged,
      wifiAccessGranted,
    };

    onSaveVisitor(newVisitor, true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {mode === 'immediate' ? 'Check In Walk-In Visitor' : 'Pre-Register Upcoming Visitor'}
              </h3>
              <p className="text-xs text-slate-400">
                Register facility credentials and trigger host automated dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 p-2 gap-2">
          <button
            type="button"
            onClick={() => setMode('immediate')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition ${
              mode === 'immediate'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Immediate Check-In (Present at Desk)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('preregister')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition ${
              mode === 'preregister'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Pre-Register / Issue Invite Pass</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Personal Info Grid */}
          <div>
            <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">
              1. Visitor Identity
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Hayes"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Company / Organization <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Innovations"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder="jordan.hayes@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Photo & Avatar Picker */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-indigo-400" />
                Badge Photo (Live Camera Snapshot / Avatar)
              </span>
              <span className="text-[11px] text-slate-500">Click to select photo</span>
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {SAMPLE_AVATARS.map((url, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setPhotoUrl(url)}
                  className={`relative rounded-xl overflow-hidden border-2 transition shrink-0 ${
                    photoUrl === url
                      ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                      : 'border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Option ${idx}`} className="w-12 h-12 object-cover" />
                  {photoUrl === url && (
                    <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Host & Visit Details */}
          <div>
            <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">
              2. Host & Campus Access
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Visiting Host / Employee <span className="text-rose-400">*</span>
                </label>
                <select
                  value={hostId}
                  onChange={(e) => setHostId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {hosts.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} — {h.department} ({h.status})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Location: {selectedHost?.officeLocation}
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Purpose of Visit
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value as VisitPurpose)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Business Meeting">Business Meeting</option>
                  <option value="Job Interview">Job Interview</option>
                  <option value="Client Demo">Client Demo</option>
                  <option value="Vendor / Delivery">Vendor / Delivery</option>
                  <option value="Contractor Work">Contractor Work</option>
                  <option value="Facility Maintenance">Facility Maintenance</option>
                  <option value="Executive / Board">Executive / Board</option>
                  <option value="VIP Tour">VIP Tour</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Designated Building Zone
                </label>
                <select
                  value={accessZone}
                  onChange={(e) => setAccessZone(e.target.value as AccessZone)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Lobby & Reception">Lobby & Reception</option>
                  <option value="Floor 1-3 General Office">Floor 1-3 General Office</option>
                  <option value="Floor 4 Executive Suites">Floor 4 Executive Suites</option>
                  <option value="R&D Innovation Lab">R&D Innovation Lab</option>
                  <option value="Data Center (Escort Only)">Data Center (Escort Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Expected Duration
                </label>
                <select
                  value={expectedDurationHours}
                  onChange={(e) => setExpectedDurationHours(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="1">1 Hour</option>
                  <option value="2">2 Hours (Standard)</option>
                  <option value="4">Half Day (4 Hours)</option>
                  <option value="8">Full Day (8 Hours)</option>
                  <option value="12">Extended Access</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security & Verification */}
          <div>
            <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">
              3. Verification & Compliance
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Identity Document Verified
                </label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Driver License">Driver License</option>
                  <option value="Passport">Passport</option>
                  <option value="Government ID">Government ID</option>
                  <option value="Corporate Badge">Corporate Badge</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  ID Last 4 Digits
                </label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="e.g. 5821"
                  value={idNumberLast4}
                  onChange={(e) => setIdNumberLast4(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Vehicle License Plate (Parking Barrier)
                </label>
                <div className="relative">
                  <Car className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="e.g. 8ABC123"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Internal Security Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Escort at elevator lobby"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Checkboxes & Flags */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2.5">
              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ndaSigned}
                  onChange={(e) => setNdaSigned(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                />
                <span className="font-medium text-white">Facility Non-Disclosure Agreement (NDA) Signed & Logged</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={safetyBriefingAcknowledged}
                  onChange={(e) => setSafetyBriefingAcknowledged(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                />
                <span>Safety, Fire Evacuation & Building Emergency Briefing Acknowledged</span>
              </label>

              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-xs text-amber-300 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={isVip}
                    onChange={(e) => setIsVip(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-900 border-slate-700"
                  />
                  <span>Mark as VIP Guest</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-rose-300 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={escortRequired}
                    onChange={(e) => setEscortRequired(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400 bg-slate-900 border-slate-700"
                  />
                  <span>Require Staff Escort</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-emerald-300 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={wifiAccessGranted}
                    onChange={(e) => setWifiAccessGranted(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-900 border-slate-700"
                  />
                  <span>Provision Guest Wi-Fi Voucher</span>
                </label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {mode === 'immediate' ? 'Complete Check-In & Issue Badge' : 'Confirm Pre-Registration'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
