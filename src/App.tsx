import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VisitorLogView } from './components/VisitorLogView';
import { KioskMode } from './components/KioskMode';
import { EmergencyRosterView } from './components/EmergencyRosterView';
import { HostDirectoryView } from './components/HostDirectoryView';
import { AnalyticsView } from './components/AnalyticsView';
import { CheckInModal } from './components/CheckInModal';
import { BadgeModal } from './components/BadgeModal';
import { VisitorDetailModal } from './components/VisitorDetailModal';
import { Visitor, Host, NotificationRecord, EmergencyEvacuationLog } from './types';
import { INITIAL_VISITORS, INITIAL_HOSTS, INITIAL_NOTIFICATIONS } from './data/mockData';
import { BellRing, CheckCircle, RotateCcw, Shield } from 'lucide-react';

const STORAGE_KEY_VISITORS = 'vms_sentinel_visitors_v1';
const STORAGE_KEY_HOSTS = 'vms_sentinel_hosts_v1';
const STORAGE_KEY_NOTIFS = 'vms_sentinel_notifs_v1';
const STORAGE_KEY_EMERGENCY = 'vms_sentinel_emergency_v1';

export function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'visitors' | 'kiosk' | 'hosts' | 'emergency' | 'analytics'>('visitors');

  // Persistence State
  const [visitors, setVisitors] = useState<Visitor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_VISITORS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved visitors:', e);
      }
    }
    return INITIAL_VISITORS;
  });

  const [hosts, setHosts] = useState<Host[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_HOSTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved hosts:', e);
      }
    }
    return INITIAL_HOSTS;
  });

  const [notifications, setNotifications] = useState<NotificationRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved notifications:', e);
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [emergencyState, setEmergencyState] = useState<EmergencyEvacuationLog>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EMERGENCY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading emergency state:', e);
      }
    }
    return { active: false };
  });

  // Modal States
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [checkInInitialMode, setCheckInInitialMode] = useState<'immediate' | 'preregister'>('immediate');
  const [badgeModalVisitor, setBadgeModalVisitor] = useState<Visitor | null>(null);
  const [detailModalVisitor, setDetailModalVisitor] = useState<Visitor | null>(null);

  // Toast alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_VISITORS, JSON.stringify(visitors));
  }, [visitors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HOSTS, JSON.stringify(hosts));
  }, [hosts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EMERGENCY, JSON.stringify(emergencyState));
  }, [emergencyState]);

  // Periodic check for overstayed visitors
  useEffect(() => {
    const checkOverstay = () => {
      const now = new Date().getTime();
      setVisitors((prev) =>
        prev.map((v) => {
          if (v.status === 'checked-in') {
            const expectedEnd = new Date(v.expectedCheckOut).getTime();
            if (now > expectedEnd) {
              return { ...v, status: 'overstayed' };
            }
          }
          return v;
        })
      );
    };

    const interval = setInterval(checkOverstay, 30000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Actions
  const handleCheckOut = (id: string) => {
    const now = new Date().toISOString();
    setVisitors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'checked-out', checkOutTime: now } : v))
    );
    const vis = visitors.find((v) => v.id === id);
    if (vis) {
      showToast(`${vis.fullName} has been checked out successfully.`);
    }
  };

  const handleCheckInExpected = (id: string) => {
    const now = new Date().toISOString();
    let checkedVisitor: Visitor | null = null;

    setVisitors((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          checkedVisitor = { ...v, status: 'checked-in', checkInTime: now };
          return checkedVisitor;
        }
        return v;
      })
    );

    if (checkedVisitor) {
      // Send notification to host
      const newNotif: NotificationRecord = {
        id: `notif-${Date.now()}`,
        timestamp: now,
        visitorName: (checkedVisitor as Visitor).fullName,
        hostName: (checkedVisitor as Visitor).hostName,
        hostEmail: hosts.find((h) => h.id === (checkedVisitor as Visitor).hostId)?.email || 'host@sentineltech.com',
        channel: 'Slack',
        message: `Expected guest ${(checkedVisitor as Visitor).fullName} (${(checkedVisitor as Visitor).company}) has arrived and checked in at Main Reception.`,
        status: 'delivered',
      };
      setNotifications((prev) => [newNotif, ...prev]);
      showToast(`Host ${(checkedVisitor as Visitor).hostName} notified via Slack.`);
      setBadgeModalVisitor(checkedVisitor);
    }
  };

  const handleSaveVisitor = (newVisitor: Visitor, notifyHost = true) => {
    setVisitors((prev) => [newVisitor, ...prev]);

    if (notifyHost) {
      const newNotif: NotificationRecord = {
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString(),
        visitorName: newVisitor.fullName,
        hostName: newVisitor.hostName,
        hostEmail: hosts.find((h) => h.id === newVisitor.hostId)?.email || 'host@sentineltech.com',
        channel: newVisitor.isVip ? 'SMS' : 'Slack',
        message: newVisitor.status === 'checked-in'
          ? `Visitor ${newVisitor.fullName} (${newVisitor.company}) has checked in at Reception. Purpose: ${newVisitor.purpose}. Assigned Zone: ${newVisitor.accessZone}.`
          : `Pre-registration invite pass issued for ${newVisitor.fullName} (${newVisitor.company}) for ${newVisitor.expectedCheckIn}.`,
        status: 'delivered',
      };
      setNotifications((prev) => [newNotif, ...prev]);
      showToast(
        newVisitor.status === 'checked-in'
          ? `Check-in recorded! Host ${newVisitor.hostName} alerted.`
          : `Guest pre-registered! Invitation pass generated.`
      );
    }

    if (newVisitor.status === 'checked-in') {
      setBadgeModalVisitor(newVisitor);
    }
  };

  const handleResendAlert = (visitor: Visitor) => {
    const newNotif: NotificationRecord = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      visitorName: visitor.fullName,
      hostName: visitor.hostName,
      hostEmail: hosts.find((h) => h.id === visitor.hostId)?.email || 'host@sentineltech.com',
      channel: 'Email',
      message: `[RE-SENT] Reminder: Your guest ${visitor.fullName} (${visitor.company}) is currently waiting at Reception desk.`,
      status: 'delivered',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Arrival reminder sent to ${visitor.hostName} via Email & Slack.`);
  };

  const handleKioskCheckOut = (badgeOrName: string): boolean => {
    const query = badgeOrName.toLowerCase().trim();
    const found = visitors.find(
      (v) =>
        (v.status === 'checked-in' || v.status === 'overstayed') &&
        (v.badgeNumber.toLowerCase() === query || v.fullName.toLowerCase().includes(query))
    );

    if (found) {
      handleCheckOut(found.id);
      return true;
    }
    return false;
  };

  const toggleEmergency = () => {
    setEmergencyState((prev) => {
      const nextActive = !prev.active;
      if (nextActive) {
        showToast('FACILITY EMERGENCY DECLARED! Emergency Roster Opened.');
        setActiveTab('emergency');
      } else {
        showToast('Emergency drill cleared. Resuming normal operations.');
      }
      return {
        active: nextActive,
        declaredAt: nextActive ? new Date().toISOString() : undefined,
        declaredBy: nextActive ? 'Chief Security Officer' : undefined,
      };
    });
  };

  const handleToggleAccountedFor = (visitorId: string) => {
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === visitorId
          ? { ...v, accountedForInEmergency: !v.accountedForInEmergency }
          : v
      )
    );
  };

  const handleMarkAllAccounted = () => {
    setVisitors((prev) =>
      prev.map((v) =>
        v.status === 'checked-in' || v.status === 'overstayed'
          ? { ...v, accountedForInEmergency: true }
          : v
      )
    );
    showToast('All active on-site visitors marked as accounted for.');
  };

  const handleDeleteVisitor = (id: string) => {
    setVisitors((prev) => prev.filter((v) => v.id !== id));
    setDetailModalVisitor(null);
    showToast('Visitor record deleted from log.');
  };

  const resetToDemoData = () => {
    setVisitors(INITIAL_VISITORS);
    setHosts(INITIAL_HOSTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setEmergencyState({ active: false });
    showToast('Reset system to default demo state.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-indigo-400/40 animate-bounce">
          <BellRing className="w-4 h-4 text-amber-300" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        visitors={visitors}
        emergencyState={emergencyState}
        toggleEmergency={toggleEmergency}
        onOpenCheckIn={() => {
          setCheckInInitialMode('immediate');
          setIsCheckInOpen(true);
        }}
        unreadAlertsCount={notifications.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {activeTab === 'visitors' && (
          <VisitorLogView
            visitors={visitors}
            onCheckOut={handleCheckOut}
            onCheckInExpected={handleCheckInExpected}
            onViewBadge={(v) => setBadgeModalVisitor(v)}
            onResendAlert={handleResendAlert}
            onOpenCheckIn={(mode) => {
              setCheckInInitialMode(mode || 'immediate');
              setIsCheckInOpen(true);
            }}
            onSelectVisitorDetails={(v) => setDetailModalVisitor(v)}
          />
        )}

        {activeTab === 'kiosk' && (
          <KioskMode
            hosts={hosts}
            onCompleteCheckIn={(newVis) => handleSaveVisitor(newVis, true)}
            onKioskCheckOut={handleKioskCheckOut}
            onExitKiosk={() => setActiveTab('visitors')}
            activeVisitors={visitors}
          />
        )}

        {activeTab === 'hosts' && (
          <HostDirectoryView
            hosts={hosts}
            notifications={notifications}
            onPreRegisterWithHost={(hostId) => {
              setCheckInInitialMode('preregister');
              setIsCheckInOpen(true);
            }}
          />
        )}

        {activeTab === 'emergency' && (
          <EmergencyRosterView
            visitors={visitors}
            emergencyState={emergencyState}
            toggleEmergency={toggleEmergency}
            onToggleAccountedFor={handleToggleAccountedFor}
            onMarkAllAccounted={handleMarkAllAccounted}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView visitors={visitors} hosts={hosts} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 sm:px-8 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-400">VMS Sentinel System</span>
            <span>— Enterprise Campus Visitor & Access Management</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={resetToDemoData}
              className="text-slate-500 hover:text-slate-300 flex items-center gap-1 transition"
              title="Reset data back to initial demo seeds"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Demo Data</span>
            </button>
            <span className="text-slate-600">|</span>
            <span>Building Alpha • Turnstiles & Kiosks Active</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {isCheckInOpen && (
        <CheckInModal
          hosts={hosts}
          onClose={() => setIsCheckInOpen(false)}
          onSaveVisitor={handleSaveVisitor}
          initialMode={checkInInitialMode}
        />
      )}

      {badgeModalVisitor && (
        <BadgeModal
          visitor={badgeModalVisitor}
          onClose={() => setBadgeModalVisitor(null)}
        />
      )}

      {detailModalVisitor && (
        <VisitorDetailModal
          visitor={detailModalVisitor}
          onClose={() => setDetailModalVisitor(null)}
          onViewBadge={(v) => {
            setDetailModalVisitor(null);
            setBadgeModalVisitor(v);
          }}
          onToggleStatus={(id) => {
            const v = visitors.find((x) => x.id === id);
            if (v?.status === 'expected') {
              handleCheckInExpected(id);
            } else {
              handleCheckOut(id);
            }
            setDetailModalVisitor(null);
          }}
          onDelete={handleDeleteVisitor}
        />
      )}
    </div>
  );
}
