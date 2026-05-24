import type { DeviceStatus, AlertSeverity, AlertStatus } from "./mocks/types";

export const STATUS_LABEL: Record<DeviceStatus, string> = {
  normal: "正常",
  abnormal: "異常",
  offline: "離線",
  maintenance: "待維修",
};

export const STATUS_COLOR: Record<DeviceStatus, string> = {
  normal: "#22c55e",
  abnormal: "#ef4444",
  offline: "#6b7280",
  maintenance: "#f97316",
};

export const SEVERITY_LABEL: Record<AlertSeverity, string> = {
  high: "高",
  medium: "中",
  low: "低",
};

export const SEVERITY_COLOR: Record<AlertSeverity, string> = {
  high: "#ef4444",
  medium: "#f97316",
  low: "#38bdf8",
};

export const ALERT_STATUS_LABEL: Record<AlertStatus, string> = {
  open: "未處理",
  in_progress: "處理中",
  resolved: "已解除",
};

export function fmtNum(n: number, digits = 1) {
  if (n === 0) return "0";
  return n.toFixed(digits);
}

export function fmtDateTime(iso: string | null) {
  if (!iso) return "--";
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fmtRelative(iso: string | null) {
  if (!iso) return "--";
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "剛剛";
  if (min < 60) return `${min} 分鐘前`;
  return fmtDateTime(iso);
}

export function recommendedAction(score: number) {
  if (score >= 80) return { label: "立即派工", level: "緊急" };
  if (score >= 60) return { label: "本週排查", level: "本週" };
  return { label: "本月追蹤", level: "本月" };
}

export function severityRank(s: AlertSeverity) {
  return s === "high" ? 0 : s === "medium" ? 1 : 2;
}
