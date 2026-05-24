export type DeviceStatus = "normal" | "abnormal" | "offline" | "maintenance";
export type AlertSeverity = "high" | "medium" | "low";
export type AlertStatus = "open" | "in_progress" | "resolved";

export interface Client {
  id: string;
  name: string;
  contact: string;
}

export interface Device {
  id: string;
  code: string;
  model: string;
  clientId: string;
  clientName: string;
  location: string;
  status: DeviceStatus;
  installedAt: string; // ISO date
  lastHeartbeatAt: string;
  riskScore: number; // 0-100
  riskReason: string;
  rankChange: "up" | "down" | "flat";
  isRealApi: boolean;
  // live metrics
  outletTemp: number; // 出水溫
  inletTemp: number; // 回水溫
  ambientTemp: number;
  compressorOn: boolean;
  pumpOn: boolean;
  powerKW: number;
  todayKWh: number;
  cop: number;
  totalRunHours: number;
}

export interface AlertItem {
  id: string;
  deviceId: string;
  deviceCode: string;
  clientName: string;
  type: string;
  severity: AlertSeverity;
  occurredAt: string;
  status: AlertStatus;
  assignee: string | null;
  assignedAt: string | null;
  resolvedAt: string | null;
  resolutionNote?: string;
}

export interface Technician {
  id: string;
  name: string;
  activeWorkOrders: number;
  monthlyClosed: number;
}

export interface DailyPoint {
  date: string; // YYYY-MM-DD
  kWh: number;
  runHours: number;
  starts: number;
  cop: number;
  anomaly?: boolean;
}

export interface Incident {
  id: string;
  deviceId: string;
  occurredAt: string;
  code: string;
  description: string;
  durationMin: number;
  resolutionNote: string;
}

export interface WorkOrder {
  id: string;
  deviceId: string;
  priority: "high" | "medium" | "low";
  dispatchedAt: string;
  completedAt: string | null;
  technician: string;
  issueDesc: string;
  resolution: string;
}

export interface SystemSettings {
  MAX_WORK_ORDERS_PER_TECH: number;
  MAX_DEVICES_PER_TECH: number;
  ALERT_OVERDUE_HOURS: number;
}
