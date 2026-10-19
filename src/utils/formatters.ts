import { VisitorStatus, AccessZone } from '../types';

export function formatDateTime(isoString?: string): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return d.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function formatTimeOnly(isoString?: string): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function getDurationString(startTime?: string, endTime?: string): string {
  if (!startTime) return '—';
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : Date.now();
  const diffMs = Math.max(0, end - start);
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;

  if (hours === 0) {
    return `${remainingMins}m`;
  }
  return `${hours}h ${remainingMins}m`;
}

export function getStatusBadgeConfig(status: VisitorStatus): { label: string; bg: string; text: string; dot: string } {
  switch (status) {
    case 'checked-in':
      return {
        label: 'Checked In',
        bg: 'bg-emerald-500/10 border-emerald-500/30',
        text: 'text-emerald-400',
        dot: 'bg-emerald-400 animate-pulse',
      };
    case 'expected':
      return {
        label: 'Expected',
        bg: 'bg-blue-500/10 border-blue-500/30',
        text: 'text-blue-400',
        dot: 'bg-blue-400',
      };
    case 'checked-out':
      return {
        label: 'Checked Out',
        bg: 'bg-slate-500/10 border-slate-600/30',
        text: 'text-slate-400',
        dot: 'bg-slate-500',
      };
    case 'overstayed':
      return {
        label: 'Overstay Alert',
        bg: 'bg-rose-500/15 border-rose-500/40',
        text: 'text-rose-400',
        dot: 'bg-rose-500 animate-ping',
      };
    case 'denied':
      return {
        label: 'Access Denied',
        bg: 'bg-red-500/20 border-red-600/40',
        text: 'text-red-400',
        dot: 'bg-red-500',
      };
  }
}

export function getZoneBadgeConfig(zone: AccessZone): { border: string; bg: string; text: string } {
  switch (zone) {
    case 'Lobby & Reception':
      return {
        border: 'border-slate-600',
        bg: 'bg-slate-800 text-slate-300',
        text: 'text-slate-300',
      };
    case 'Floor 1-3 General Office':
      return {
        border: 'border-indigo-500/40',
        bg: 'bg-indigo-950/60 text-indigo-300',
        text: 'text-indigo-300',
      };
    case 'Floor 4 Executive Suites':
      return {
        border: 'border-amber-500/40',
        bg: 'bg-amber-950/60 text-amber-300',
        text: 'text-amber-300',
      };
    case 'R&D Innovation Lab':
      return {
        border: 'border-purple-500/40',
        bg: 'bg-purple-950/60 text-purple-300',
        text: 'text-purple-300',
      };
    case 'Data Center (Escort Only)':
      return {
        border: 'border-rose-500/50',
        bg: 'bg-rose-950/60 text-rose-300',
        text: 'text-rose-300',
      };
  }
}

export function generateBadgeNumber(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `VMS-${randomNum}`;
}

export function exportVisitorsToCSV(visitors: any[]): void {
  const headers = [
    'Badge #',
    'Visitor Name',
    'Email',
    'Phone',
    'Company',
    'Host',
    'Host Dept',
    'Purpose',
    'Status',
    'Access Zone',
    'Check In',
    'Check Out',
    'NDA Signed',
    'Escort Required',
  ];

  const rows = visitors.map((v) => [
    `"${v.badgeNumber}"`,
    `"${v.fullName}"`,
    `"${v.email}"`,
    `"${v.phone}"`,
    `"${v.company}"`,
    `"${v.hostName}"`,
    `"${v.hostDepartment}"`,
    `"${v.purpose}"`,
    `"${v.status}"`,
    `"${v.accessZone}"`,
    `"${v.checkInTime ? new Date(v.checkInTime).toLocaleString() : ''}"`,
    `"${v.checkOutTime ? new Date(v.checkOutTime).toLocaleString() : ''}"`,
    `"${v.ndaSigned ? 'Yes' : 'No'}"`,
    `"${v.escortRequired ? 'Yes' : 'No'}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `VMS-Visitor-Log-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
