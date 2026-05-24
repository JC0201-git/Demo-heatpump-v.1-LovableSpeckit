import { srand, randInt, rand, pick } from "./seed";
import type {
  Device,
  Client,
  AlertItem,
  Technician,
  DailyPoint,
  Incident,
  WorkOrder,
  SystemSettings,
  DeviceStatus,
  AlertSeverity,
  AlertStatus,
} from "./types";

// reset seed for stable output
srand(20260517);

const CLIENT_NAMES = [
  "華晟食品",
  "永豐紡織",
  "宏遠精密",
  "天和水產",
  "正大化工",
  "東陽工業",
  "嘉新乳品",
  "瑞展科技",
  "大同醫療",
  "中興旅館",
  "金成染整",
  "南光製藥",
  "立翔機械",
  "聯豐電子",
  "新世紀餐飲",
];

const LOCATIONS = [
  "桃園廠 A 棟",
  "桃園廠 B 棟",
  "新竹科學園區",
  "台中港區",
  "彰化二林廠",
  "雲林斗六廠",
  "台南安平廠",
  "高雄岡山廠",
  "新北樹林廠",
  "宜蘭利澤廠",
];

const MODELS = ["HP-A200", "HP-A350", "HP-X500", "HP-X800", "HW-Pro120"];

const RISK_REASONS = [
  "連續 3 日 COP 低於閾值",
  "壓縮機高溫告警頻發",
  "出水溫度震盪超出範圍",
  "近 7 日異常次數 ≥ 5",
  "回水溫度感測器異常",
  "用電量較上月飆升 35%",
  "長時間未進行保養",
  "水泵電流異常",
];

const ALERT_TYPES = [
  "高壓異常",
  "低壓異常",
  "出水溫度過高",
  "回水溫度異常",
  "壓縮機過載",
  "水泵故障",
  "通訊中斷",
  "COP 過低",
  "感測器離線",
];

const TECH_NAMES = ["陳志明", "林文豪", "張雅婷", "王俊傑", "李建華", "黃淑芬"];

// ---------- Clients ----------
export const clients: Client[] = CLIENT_NAMES.map((name, i) => ({
  id: `C${(i + 1).toString().padStart(3, "0")}`,
  name,
  contact: `0987-${randInt(100, 999)}-${randInt(100, 999)}`,
}));

// ---------- Devices (80) ----------
function makeDevices(): Device[] {
  const arr: Device[] = [];
  const statusPool: DeviceStatus[] = [
    "normal",
    "normal",
    "normal",
    "normal",
    "normal",
    "normal",
    "abnormal",
    "abnormal",
    "offline",
    "maintenance",
  ];
  for (let i = 1; i <= 80; i++) {
    const client = clients[i % clients.length];
    const status = pick(statusPool);
    const installedDaysAgo = randInt(20, 1500);
    const installedAt = new Date(Date.now() - installedDaysAgo * 86400_000).toISOString();
    const riskScore =
      status === "abnormal"
        ? randInt(70, 99)
        : status === "maintenance"
          ? randInt(45, 75)
          : status === "offline"
            ? randInt(35, 60)
            : randInt(5, 55);
    const lastHb =
      status === "offline"
        ? new Date(Date.now() - randInt(30, 600) * 60_000).toISOString()
        : new Date(Date.now() - randInt(5, 120) * 1000).toISOString();
    const compressorOn = status === "normal" || status === "abnormal";
    const outlet = status === "offline" ? 0 : rand(48, 62);
    const inlet = status === "offline" ? 0 : outlet - rand(4, 8);
    arr.push({
      id: `D${i.toString().padStart(3, "0")}`,
      code: `HP-${(2000 + i).toString()}`,
      model: pick(MODELS),
      clientId: client.id,
      clientName: client.name,
      location: pick(LOCATIONS),
      status,
      installedAt,
      lastHeartbeatAt: lastHb,
      riskScore,
      riskReason: pick(RISK_REASONS),
      rankChange: pick(["up", "down", "flat", "flat"] as const),
      isRealApi: i <= 7,
      outletTemp: +outlet.toFixed(1),
      inletTemp: +inlet.toFixed(1),
      ambientTemp: +rand(22, 34).toFixed(1),
      compressorOn,
      pumpOn: status !== "offline",
      powerKW: status === "offline" ? 0 : +rand(8, 28).toFixed(2),
      todayKWh: status === "offline" ? 0 : +rand(40, 280).toFixed(1),
      cop: status === "offline" ? 0 : +rand(2.4, 4.8).toFixed(2),
      totalRunHours: randInt(500, 22000),
    });
  }
  return arr;
}
export const devices: Device[] = makeDevices();

// ---------- Alerts ----------
function makeAlerts(): AlertItem[] {
  const arr: AlertItem[] = [];
  const sevPool: AlertSeverity[] = ["high", "high", "medium", "medium", "low"];
  const statusPool: AlertStatus[] = [
    "open",
    "open",
    "in_progress",
    "in_progress",
    "resolved",
    "resolved",
  ];
  const abnormal = devices.filter(
    (d) => d.status === "abnormal" || d.status === "maintenance",
  );
  const sourceDevices = abnormal.length >= 30 ? abnormal : devices;
  for (let i = 0; i < 60; i++) {
    const d = sourceDevices[i % sourceDevices.length];
    const sev = pick(sevPool);
    const status = pick(statusPool);
    const occurredAt = new Date(
      Date.now() - randInt(10, 60 * 24 * 30) * 60_000,
    ).toISOString();
    const assigned = status !== "open";
    const resolved = status === "resolved";
    arr.push({
      id: `A${(i + 1).toString().padStart(4, "0")}`,
      deviceId: d.id,
      deviceCode: d.code,
      clientName: d.clientName,
      type: pick(ALERT_TYPES),
      severity: sev,
      occurredAt,
      status,
      assignee: assigned ? pick(TECH_NAMES) : null,
      assignedAt: assigned
        ? new Date(new Date(occurredAt).getTime() + randInt(5, 60) * 60_000).toISOString()
        : null,
      resolvedAt: resolved
        ? new Date(
            new Date(occurredAt).getTime() + randInt(60, 600) * 60_000,
          ).toISOString()
        : null,
      resolutionNote: resolved ? "現場更換零件並校正參數" : undefined,
    });
  }
  return arr;
}
export const alertsSeed: AlertItem[] = makeAlerts();

// ---------- Technicians ----------
export const technicians: Technician[] = TECH_NAMES.map((n, i) => ({
  id: `T${i + 1}`,
  name: n,
  activeWorkOrders: randInt(2, 9),
  monthlyClosed: randInt(8, 28),
}));

// ---------- Daily telemetry (30 days for any device) ----------
export function genDailyPoints(deviceId: string, days = 30): DailyPoint[] {
  srand(parseInt(deviceId.replace(/\D/g, "")) * 7 + 1);
  const out: DailyPoint[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400_000);
    const baseKWh = rand(120, 220);
    const isAnom = srand() < 0.07;
    const kWh = isAnom ? baseKWh * rand(1.4, 1.8) : baseKWh;
    out.push({
      date: d.toISOString().slice(0, 10),
      kWh: +kWh.toFixed(1),
      runHours: +rand(10, 22).toFixed(1),
      starts: randInt(3, 14),
      cop: +rand(2.5, 4.6).toFixed(2),
      anomaly: isAnom,
    });
  }
  return out;
}

// ---------- Incidents per device ----------
export function genIncidents(deviceId: string): Incident[] {
  srand(parseInt(deviceId.replace(/\D/g, "")) * 13 + 5);
  const n = randInt(2, 8);
  const out: Incident[] = [];
  for (let i = 0; i < n; i++) {
    out.push({
      id: `I${deviceId}-${i}`,
      deviceId,
      occurredAt: new Date(Date.now() - randInt(1, 90) * 86400_000).toISOString(),
      code: `E${randInt(100, 999)}`,
      description: pick(ALERT_TYPES),
      durationMin: randInt(8, 240),
      resolutionNote: pick([
        "重啟壓縮機後恢復",
        "更換高壓感測器",
        "現場清洗冷凝器",
        "調整膨脹閥開度",
        "韌體更新後復原",
      ]),
    });
  }
  return out.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
}

// ---------- Work orders per device ----------
export function genWorkOrders(deviceId: string): WorkOrder[] {
  srand(parseInt(deviceId.replace(/\D/g, "")) * 17 + 9);
  const n = randInt(1, 5);
  const out: WorkOrder[] = [];
  for (let i = 0; i < n; i++) {
    const dispatched = new Date(Date.now() - randInt(5, 200) * 86400_000);
    const completed =
      srand() < 0.8
        ? new Date(dispatched.getTime() + randInt(2, 72) * 3600_000)
        : null;
    out.push({
      id: `WO-${deviceId}-${i + 1}`,
      deviceId,
      priority: pick(["high", "medium", "low"] as const),
      dispatchedAt: dispatched.toISOString(),
      completedAt: completed ? completed.toISOString() : null,
      technician: pick(TECH_NAMES),
      issueDesc: pick([
        "壓縮機運轉異音",
        "出水溫度持續偏低",
        "顯示面板閃爍",
        "水泵異常停機",
        "排水管阻塞",
      ]),
      resolution: completed ? "更換故障零件並現場測試正常" : "派工中",
    });
  }
  return out.sort((a, b) => b.dispatchedAt.localeCompare(a.dispatchedAt));
}

// ---------- System Settings ----------
export const systemSettings: SystemSettings = {
  MAX_WORK_ORDERS_PER_TECH: 10,
  MAX_DEVICES_PER_TECH: 20,
  ALERT_OVERDUE_HOURS: 24,
};

export const ALERT_TYPE_OPTIONS = ALERT_TYPES;
export const TECH_NAME_OPTIONS = TECH_NAMES;
