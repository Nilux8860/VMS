export type VisitorStatus = 'checked-in' | 'expected' | 'checked-out' | 'overstayed' | 'denied';

export type VisitPurpose = 
  | 'Business Meeting'
  | 'Job Interview'
  | 'Client Demo'
  | 'Vendor / Delivery'
  | 'Contractor Work'
  | 'Facility Maintenance'
  | 'Executive / Board'
  | 'VIP Tour';

export type AccessZone = 
  | 'Lobby & Reception'
  | 'Floor 1-3 General Office'
  | 'Floor 4 Executive Suites'
  | 'R&D Innovation Lab'
  | 'Data Center (Escort Only)';

export interface Visitor {
  id: string;
  badgeNumber: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  hostId: string;
  hostName: string;
  hostDepartment: string;
  purpose: VisitPurpose;
  checkInTime?: string;
  checkOutTime?: string;
  expectedCheckIn: string;
  expectedCheckOut: string;
  status: VisitorStatus;
  accessZone: AccessZone;
  photoUrl: string;
  ndaSigned: boolean;
  ndaSignedAt?: string;
  idType: 'Driver License' | 'Passport' | 'Government ID' | 'Corporate Badge';
  idNumberLast4: string;
  notes?: string;
  isVip?: boolean;
  isFlagged?: boolean;
  escortRequired: boolean;
  safetyBriefingAcknowledged: boolean;
  vehiclePlate?: string;
  wifiAccessGranted?: boolean;
  accountedForInEmergency?: boolean;
}

export interface Host {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  officeLocation: string;
  avatarUrl: string;
  status: 'available' | 'in-meeting' | 'out-of-office';
}

export interface NotificationRecord {
  id: string;
  timestamp: string;
  visitorName: string;
  hostName: string;
  hostEmail: string;
  channel: 'Slack' | 'Email' | 'SMS';
  message: string;
  status: 'delivered' | 'pending';
}

export interface EmergencyEvacuationLog {
  active: boolean;
  declaredAt?: string;
  declaredBy?: string;
  notes?: string;
}
