import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  QrCode, 
  LogOut, 
  ChevronRight, 
  CheckCircle2, 
  ShieldCheck, 
  Camera, 
  Wifi, 
  ArrowLeft,
  XCircle,
  FileText
} from 'lucide-react';
import { Host, Visitor, VisitPurpose, AccessZone } from '../types';
import { generateBadgeNumber, formatTimeOnly } from '../utils/formatters';

interface KioskModeProps {
  hosts: Host[];
  onCompleteCheckIn: (visitor: Visitor) => void;
  onKioskCheckOut: (badgeOrName: string) => boolean;
  onExitKiosk: () => void;
  activeVisitors: Visitor[];
}

export const KioskMode: React.FC<KioskModeProps> = ({
  hosts,
  onCompleteCheckIn,
  onKioskCheckOut,
  onExitKiosk,
  activeVisitors,
}) => {
  const [kioskStep, setKioskStep] = useState<'home' | 'prereg' | 'walkin-1' | 'walkin-2' | 'walkin-photo' | 'walkin-nda' | 'success' | 'checkout'>('home');
  
  // Registration State
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hostId, setHostId] = useState(hosts[0]?.id || '');
  const [purpose, setPurpose] = useState<VisitPurpose>('Business Meeting');
  const [selectedPhoto, setSelectedPhoto] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80');
  const [ndaAccepted, setNdaAccepted] = useState(false);
  const [issuedVisitor, setIssuedVisitor] = useState<Visitor | null>(null);

  // Pre-reg lookup code
  const [preRegCode, setPreRegCode] = useState('');
  const [preRegError, setPreRegError] = useState('');

  // Checkout lookup
  const [checkoutQuery, setCheckoutQuery] = useState('');
  const [checkoutMessage, setCheckoutMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleLookupPreReg = (e: React.FormEvent) => {
    e.preventDefault();
    const found = activeVisitors.find(
      (v) =>
        v.badgeNumber.toLowerCase() === preRegCode.trim().toLowerCase() ||
        v.email.toLowerCase() === preRegCode.trim().toLowerCase()
    );

    if (found) {
      // Mark checked-in
      const updated: Visitor = {
        ...found,
        status: 'checked-in',
        checkInTime: new Date().toISOString(),
      };
      setIssuedVisitor(updated);
      onCompleteCheckIn(updated);
      setKioskStep('success');
      setPreRegError('');
    } else {
      setPreRegError('No matching reservation found. Please verify your badge number or register as a new visitor.');
    }
  };

  const handleFinishWalkIn = () => {
    const selectedHost = hosts.find((h) => h.id === hostId) || hosts[0];
    const now = new Date();
    const newVisitor: Visitor = {
      id: `vis-${Date.now()}`,
      badgeNumber: generateBadgeNumber(),
      fullName: fullName.trim(),
      company: company.trim(),
      email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '')}@guest.local`,
      phone: phone.trim() || '+1 (555) 901-2345',
      hostId: selectedHost.id,
      hostName: selectedHost.name,
      hostDepartment: selectedHost.department,
      purpose,
      accessZone: 'Floor 1-3 General Office',
      status: 'checked-in',
      checkInTime: now.toISOString(),
      expectedCheckIn: now.toISOString(),
      expectedCheckOut: new Date(now.getTime() + 3 * 3600 * 1000).toISOString(),
      photoUrl: selectedPhoto,
      ndaSigned: true,
      ndaSignedAt: now.toISOString(),
      idType: 'Driver License',
      idNumberLast4: '7721',
      escortRequired: false,
      safetyBriefingAcknowledged: true,
      wifiAccessGranted: true,
    };

    setIssuedVisitor(newVisitor);
    onCompleteCheckIn(newVisitor);
    setKioskStep('success');
  };

  const handleKioskCheckOutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onKioskCheckOut(checkoutQuery);
    if (success) {
      setCheckoutMessage({
        type: 'success',
        text: 'Thank you for visiting! You have been checked out safely. Have a wonderful day!',
      });
      setTimeout(() => {
        setKioskStep('home');
        setCheckoutQuery('');
        setCheckoutMessage(null);
      }, 3000);
    } else {
      setCheckoutMessage({
        type: 'error',
        text: 'Visitor badge or name not found in currently checked-in list. Please see the receptionist for assistance.',
      });
    }
  };

  const resetKiosk = () => {
    setFullName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setNdaAccepted(false);
    setPreRegCode('');
    setPreRegError('');
    setCheckoutQuery('');
    setCheckoutMessage(null);
    setIssuedVisitor(null);
    setKioskStep('home');
  };

  return (
    <div className="relative min-h-[750px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-12 overflow-hidden flex flex-col justify-between">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Kiosk Bar */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Sentinel Campus Reception
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Visitor Self-Service Terminal • Building A
            </p>
          </div>
        </div>

        <button
          onClick={onExitKiosk}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
        >
          Exit Kiosk Mode
        </button>
      </div>

      {/* Main Kiosk Flow Content */}
      <div className="my-auto py-8 z-10 max-w-3xl mx-auto w-full">
        {/* STEP: HOME */}
        {kioskStep === 'home' && (
          <div className="text-center space-y-8 animate-fadeIn">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Touch Screen To Begin
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Welcome to Sentinel Tech
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
                Please register your visit for campus security credentials, automated host notification, and building access pass.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-2xl mx-auto">
              <button
                onClick={() => setKioskStep('prereg')}
                className="p-6 bg-slate-900/90 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/50 rounded-2xl text-left transition transform hover:-translate-y-1 shadow-xl group flex flex-col justify-between"
              >
                <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl w-fit mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1">
                    I Have an Invite / Pass
                  </h3>
                  <p className="text-xs text-slate-400">
                    Fast check-in via QR code or reservation badge number
                  </p>
                </div>
              </button>

              <button
                onClick={() => setKioskStep('walkin-1')}
                className="p-6 bg-gradient-to-br from-indigo-900/60 to-slate-900 border border-indigo-500/40 hover:border-indigo-400 rounded-2xl text-left transition transform hover:-translate-y-1 shadow-xl group flex flex-col justify-between"
              >
                <div className="p-3 bg-indigo-600 text-white rounded-xl w-fit mb-4 shadow-md shadow-indigo-600/30">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1">
                    New Visitor Sign-In
                  </h3>
                  <p className="text-xs text-slate-300">
                    Quick 1-minute registration & digital badge printing
                  </p>
                </div>
              </button>

              <button
                onClick={() => setKioskStep('checkout')}
                className="p-6 bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-2xl text-left transition transform hover:-translate-y-1 shadow-xl group flex flex-col justify-between"
              >
                <div className="p-3 bg-slate-800 text-rose-400 rounded-xl w-fit mb-4 group-hover:bg-rose-500 group-hover:text-white transition">
                  <LogOut className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1">
                    Check Out
                  </h3>
                  <p className="text-xs text-slate-400">
                    Complete your visit and surrender visitor badge
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP: PRE-REGISTRATION LOOKUP */}
        {kioskStep === 'prereg' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-lg mx-auto shadow-2xl animate-fadeIn">
            <button
              onClick={() => setKioskStep('home')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Main
            </button>

            <h3 className="text-xl font-bold text-white mb-2">Scan or Enter Badge Pass</h3>
            <p className="text-xs text-slate-400 mb-6">
              Enter your VMS pass code (e.g. VMS-9406) or your pre-registered email address.
            </p>

            <form onSubmit={handleLookupPreReg} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Enter VMS Badge # or Email..."
                value={preRegCode}
                onChange={(e) => setPreRegCode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm font-medium"
              />

              {preRegError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>{preRegError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition shadow-lg shadow-indigo-600/20"
              >
                Validate Pass & Check In
              </button>
            </form>
          </div>
        )}

        {/* STEP: WALKIN - 1 (Identity) */}
        {kioskStep === 'walkin-1' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-xl mx-auto shadow-2xl animate-fadeIn">
            <button
              onClick={() => setKioskStep('home')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Cancel
            </button>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Step 1 of 3: Your Information</h3>
                <p className="text-xs text-slate-400">Please provide your contact details for visitor credentials</p>
              </div>
              <span className="text-xs font-mono text-indigo-400">1 / 3</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Legal Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Adams"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Company / Organization <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NextGen Robotics"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="rachel@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 012-3456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={!fullName.trim() || !company.trim()}
                onClick={() => setKioskStep('walkin-2')}
                className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                <span>Continue to Host Selection</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP: WALKIN - 2 (Host & Purpose) */}
        {kioskStep === 'walkin-2' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-xl mx-auto shadow-2xl animate-fadeIn">
            <button
              onClick={() => setKioskStep('walkin-1')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Step 2 of 3: Host & Purpose</h3>
                <p className="text-xs text-slate-400">Select the person you are visiting on campus</p>
              </div>
              <span className="text-xs font-mono text-indigo-400">2 / 3</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Host Employee to Visit
                </label>
                <select
                  value={hostId}
                  onChange={(e) => setHostId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {hosts.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.department}) — {h.officeLocation}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Visit Purpose
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value as VisitPurpose)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Business Meeting">Business Meeting</option>
                  <option value="Job Interview">Job Interview</option>
                  <option value="Client Demo">Client Demo</option>
                  <option value="Vendor / Delivery">Vendor / Delivery</option>
                  <option value="Contractor Work">Contractor Work</option>
                  <option value="Facility Maintenance">Facility Maintenance</option>
                  <option value="VIP Tour">VIP Tour</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setKioskStep('walkin-nda')}
                className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                <span>Continue to NDA Agreement</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP: WALKIN - NDA */}
        {kioskStep === 'walkin-nda' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-xl mx-auto shadow-2xl animate-fadeIn">
            <button
              onClick={() => setKioskStep('walkin-2')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Step 3 of 3: Safety & Confidentiality</h3>
                <p className="text-xs text-slate-400">Please review facility policies before badge issuance</p>
              </div>
              <span className="text-xs font-mono text-indigo-400">3 / 3</span>
            </div>

            {/* NDA Agreement Text Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 max-h-48 overflow-y-auto text-xs text-slate-400 space-y-2 mb-4">
              <p className="font-semibold text-slate-200">
                SENTINEL TECHNOLOGY CAMPUS VISITOR AGREEMENT:
              </p>
              <p>
                1. <strong>Confidentiality:</strong> During your visit, you may witness proprietary hardware, code, research, or discussions. You agree to hold all non-public information strictly confidential.
              </p>
              <p>
                2. <strong>Photography & Recording:</strong> Cameras, photography, and audio recording are strictly prohibited inside labs and development zones without prior written clearance.
              </p>
              <p>
                3. <strong>Building Safety & Emergencies:</strong> In the event of a fire alarm or emergency evacuation, immediately exit through the nearest illuminated stairwell and gather at Assembly Point B (North Lawn).
              </p>
              <p>
                4. <strong>Badge Display:</strong> Your visitor badge must remain clearly visible above the waist at all times on campus grounds.
              </p>
            </div>

            <label className="flex items-center gap-3 p-3 bg-slate-950/60 border border-slate-800 rounded-xl cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={ndaAccepted}
                onChange={(e) => setNdaAccepted(e.target.checked)}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
              />
              <span className="text-xs text-slate-200 font-medium">
                I have read and agree to the Campus Safety Protocol and Non-Disclosure Agreement.
              </span>
            </label>

            <button
              type="button"
              disabled={!ndaAccepted}
              onClick={handleFinishWalkIn}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Sign Agreement & Issue Badge</span>
            </button>
          </div>
        )}

        {/* STEP: SUCCESS */}
        {kioskStep === 'success' && issuedVisitor && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-lg mx-auto shadow-2xl text-center animate-fadeIn space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Check-In Complete
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                Welcome, {issuedVisitor.fullName}!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Your host <strong className="text-slate-200">{issuedVisitor.hostName}</strong> has been notified of your arrival.
              </p>
            </div>

            {/* Pass Preview Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Assigned Badge</span>
                <p className="text-lg font-mono font-bold text-indigo-400">{issuedVisitor.badgeNumber}</p>
                <p className="text-xs text-slate-300 font-medium">{issuedVisitor.company}</p>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Wi-Fi: Sentinel-Guest</span>
                </div>
              </div>
              <div className="p-2 bg-white rounded-lg">
                <QrCode className="w-14 h-14 text-slate-950" />
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Please collect your adhesive visitor badge from the tray below and have a seat in the lobby.
            </p>

            <button
              onClick={resetKiosk}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition"
            >
              Done (Return to Welcome Screen)
            </button>
          </div>
        )}

        {/* STEP: CHECKOUT */}
        {kioskStep === 'checkout' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-lg mx-auto shadow-2xl animate-fadeIn">
            <button
              onClick={() => setKioskStep('home')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Main
            </button>

            <h3 className="text-xl font-bold text-white mb-2">Visitor Self Check-Out</h3>
            <p className="text-xs text-slate-400 mb-6">
              Enter your VMS badge number or your full name to conclude your visit.
            </p>

            <form onSubmit={handleKioskCheckOutSubmit} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Badge # (e.g. VMS-9401) or Full Name..."
                value={checkoutQuery}
                onChange={(e) => setCheckoutQuery(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm font-medium"
              />

              {checkoutMessage && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                    checkoutMessage.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {checkoutMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{checkoutMessage.text}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold text-sm transition shadow-lg shadow-rose-600/20"
              >
                Complete Check Out
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Bottom Footer Info */}
      <div className="text-center text-xs text-slate-500 z-10 pt-4 border-t border-slate-800/60">
        Sentinel VMS Kiosk v2.4 • In case of technical difficulty, speak with the front desk attendant.
      </div>
    </div>
  );
};
