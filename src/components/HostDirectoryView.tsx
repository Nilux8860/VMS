import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Bell, 
  Send, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  Search
} from 'lucide-react';
import { Host, NotificationRecord } from '../types';
import { formatDateTime } from '../utils/formatters';

interface HostDirectoryViewProps {
  hosts: Host[];
  notifications: NotificationRecord[];
  onPreRegisterWithHost: (hostId: string) => void;
}

export const HostDirectoryView: React.FC<HostDirectoryViewProps> = ({
  hosts,
  notifications,
  onPreRegisterWithHost,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'notifications'>('directory');
  const [searchHost, setSearchHost] = useState('');

  const filteredHosts = hosts.filter(
    (h) =>
      h.name.toLowerCase().includes(searchHost.toLowerCase()) ||
      h.department.toLowerCase().includes(searchHost.toLowerCase()) ||
      h.role.toLowerCase().includes(searchHost.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Sub Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('directory')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              activeSubTab === 'directory'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Host Employee Directory ({hosts.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('notifications')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              activeSubTab === 'notifications'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Automated Dispatch Log ({notifications.length})</span>
          </button>
        </div>

        {activeSubTab === 'directory' && (
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search host or department..."
              value={searchHost}
              onChange={(e) => setSearchHost(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      {/* Directory Grid */}
      {activeSubTab === 'directory' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHosts.map((host) => {
            const isAvailable = host.status === 'available';
            const isMeeting = host.status === 'in-meeting';

            return (
              <div
                key={host.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={host.avatarUrl}
                        alt={host.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-sm"
                      />
                      <div>
                        <h3 className="font-semibold text-white text-sm">{host.name}</h3>
                        <p className="text-xs text-indigo-400 font-medium">{host.role}</p>
                        <p className="text-[11px] text-slate-400">{host.department}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        isAvailable
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : isMeeting
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {host.status === 'available'
                        ? 'Available'
                        : host.status === 'in-meeting'
                        ? 'In Meeting'
                        : 'Out of Office'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{host.officeLocation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{host.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{host.phone}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onPreRegisterWithHost(host.id)}
                  className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600 hover:text-white text-indigo-300 rounded-xl text-xs font-semibold border border-indigo-500/30 transition flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Pre-Register Guest for {host.name.split(' ')[0]}</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* Notifications History */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Automated Host Arrival Notification Stream (Slack, SMS & Email)</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Webhook Services Online
            </span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {notifications.map((notif) => (
              <div key={notif.id} className="p-4 sm:p-5 hover:bg-slate-800/30 transition flex items-start gap-4">
                <div
                  className={`p-2.5 rounded-xl border shrink-0 ${
                    notif.channel === 'Slack'
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      : notif.channel === 'SMS'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-xs sm:text-sm">
                        To: {notif.hostName}
                      </span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                        {notif.channel}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {formatDateTime(notif.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80 font-mono">
                    {notif.message}
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                    <span>Target: {notif.hostEmail}</span>
                    <span>•</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Delivered
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
