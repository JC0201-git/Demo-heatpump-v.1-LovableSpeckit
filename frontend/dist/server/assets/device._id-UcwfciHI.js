import { K as jsxRuntimeExports, T as reactExports } from "./server-CzeLhqbS.js";
import { a as useParams, L as Link } from "./router-sZOWJ7Yg.js";
import { b as AppShell, u as useAppState, j as genDailyPoints, k as genIncidents, l as genWorkOrders, g as cn, h as fmtDateTime } from "./app-shell-BIbYDl8S.js";
import { P as PageHeader, M as MetricCard, S as Section, E as EmptyState } from "./ui-bits--3L9Te_T.js";
import { a as StatusBadge } from "./badges-CEMelYE4.js";
import { c as createLucideIcon, A as Activity } from "./activity-F8GmJbQr.js";
import { T as Thermometer, Z as Zap, G as Gauge } from "./zap-BEUtTxBE.js";
import { e as ResponsiveContainer, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, R as ReferenceDot } from "./generateCategoricalChart-5mld-MbB.js";
import { a as LineChart, L as Line } from "./LineChart-CaIZbaXL.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode);
const TABS = [{
  key: "power",
  label: "用電紀錄"
}, {
  key: "operation",
  label: "運轉紀錄"
}, {
  key: "incidents",
  label: "異常紀錄"
}, {
  key: "workorders",
  label: "維修紀錄"
}];
function DeviceDetail() {
  const {
    id
  } = useParams({
    from: "/device/$id"
  });
  const {
    devices
  } = useAppState();
  const device = devices.find((d) => d.id === id);
  const [tab, setTab] = reactExports.useState("power");
  if (!device) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "找不到設備 ",
        id
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/overview", className: "text-primary hover:underline mt-2 inline-block", children: "← 返回總覽" })
    ] });
  }
  const installedDaysAgo = Math.floor((Date.now() - new Date(device.installedAt).getTime()) / 864e5);
  const days = Math.min(30, installedDaysAgo);
  const points = reactExports.useMemo(() => genDailyPoints(device.id, days), [device.id, days]);
  const incidents = reactExports.useMemo(() => genIncidents(device.id), [device.id]);
  const workOrders = reactExports.useMemo(() => genWorkOrders(device.id), [device.id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/overview", className: "text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-3.5 h-3.5" }),
      " 返回設備總覽"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: `${device.code}　${device.clientName}`, description: `型號 ${device.model} · ${device.location} · 安裝於 ${device.installedAt.slice(0, 10)}（${installedDaysAgo} 天）`, actions: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: device.status }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "出水溫度", value: device.status === "offline" ? "--" : device.outletTemp.toFixed(1), unit: "°C", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Thermometer, { className: "w-4 h-4 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "回水溫度", value: device.status === "offline" ? "--" : device.inletTemp.toFixed(1), unit: "°C", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Thermometer, { className: "w-4 h-4 text-[#38bdf8]" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "環境溫度", value: device.status === "offline" ? "--" : device.ambientTemp.toFixed(1), unit: "°C" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "即時功率", value: device.status === "offline" ? "--" : device.powerKW.toFixed(2), unit: "kW", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-[#f97316]" }), accent: device.powerKW > 22 ? "warn" : void 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "COP 效率", value: device.status === "offline" ? "--" : device.cop.toFixed(2), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "w-4 h-4 text-primary" }), accent: device.cop > 0 && device.cop < 2.8 ? "error" : "ok" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "累積運轉", value: device.totalRunHours.toLocaleString(), unit: "hr", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4 text-muted-foreground" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "壓縮機", value: device.compressorOn ? "運轉中" : "停機", accent: device.compressorOn ? "ok" : void 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "水泵", value: device.pumpOn ? "運轉中" : "停機", accent: device.pumpOn ? "ok" : void 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "今日能耗", value: device.todayKWh.toFixed(1), unit: "kWh" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "風險分數", value: device.riskScore, accent: device.riskScore >= 70 ? "error" : device.riskScore >= 40 ? "warn" : "ok", hint: device.riskReason })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mb-4 border-b border-border overflow-x-auto", children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(t.key), className: cn("px-3 sm:px-4 h-9 text-sm whitespace-nowrap transition-colors focus-ring rounded-t", tab === t.key ? "text-primary border-b-2 border-primary font-semibold -mb-px" : "text-muted-foreground hover:text-foreground"), children: t.label }, t.key)) }),
      installedDaysAgo < 30 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 text-xs text-muted-foreground italic", children: [
        "資料期間：",
        device.installedAt.slice(0, 10),
        " ～ 今日（共 ",
        installedDaysAgo,
        " 天，未滿 30 天）"
      ] }),
      tab === "power" && /* @__PURE__ */ jsxRuntimeExports.jsx(PowerChart, { points }),
      tab === "operation" && /* @__PURE__ */ jsxRuntimeExports.jsx(OperationChart, { points }),
      tab === "incidents" && /* @__PURE__ */ jsxRuntimeExports.jsx(IncidentsList, { items: incidents }),
      tab === "workorders" && /* @__PURE__ */ jsxRuntimeExports.jsx(WorkOrdersList, { items: workOrders })
    ] })
  ] });
}
function PowerChart({
  points
}) {
  if (points.length === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {});
  const anomalies = points.filter((p) => p.anomaly);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-80", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: points, margin: {
    top: 8,
    right: 16,
    left: 4,
    bottom: 4
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "#ffffff10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "date", stroke: "#9ca3af", fontSize: 10, tickFormatter: (d) => d.slice(5) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "#9ca3af", fontSize: 10, unit: " kWh" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
      background: "#0a1814",
      border: "1px solid #ffffff20",
      borderRadius: 6,
      fontSize: 12
    }, labelStyle: {
      color: "#a3e635"
    }, formatter: (v, _n, p) => [`${v} kWh${p?.payload?.anomaly ? " · 異常" : ""}`, "用電量"] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "kWh", stroke: "#a3e635", strokeWidth: 2, dot: false }),
    anomalies.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(ReferenceDot, { x: a.date, y: a.kWh, r: 5, fill: "#ef4444", stroke: "#fff", strokeWidth: 1 }, a.date))
  ] }) }) });
}
function OperationChart({
  points
}) {
  const totalHours = points.reduce((s, p) => s + p.runHours, 0);
  const totalStarts = points.reduce((s, p) => s + p.starts, 0);
  const avgCop = points.reduce((s, p) => s + p.cop, 0) / Math.max(1, points.length);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "期間累計運轉", value: totalHours.toFixed(1), unit: "hr" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "期間總開機次數", value: totalStarts, unit: "次" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "平均 COP", value: avgCop.toFixed(2), accent: avgCop < 2.8 ? "error" : "ok" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: points, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "#ffffff10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "date", stroke: "#9ca3af", fontSize: 10, tickFormatter: (d) => d.slice(5) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "#9ca3af", fontSize: 10 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
        background: "#0a1814",
        border: "1px solid #ffffff20",
        borderRadius: 6,
        fontSize: 12
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "cop", stroke: "#38bdf8", strokeWidth: 2, dot: false, name: "COP" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "runHours", stroke: "#a3e635", strokeWidth: 2, dot: false, name: "運轉時數" })
    ] }) }) })
  ] });
}
function IncidentsList({
  items
}) {
  if (items.length === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-background rounded border border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground w-36 flex-shrink-0", children: fmtDateTime(it.occurredAt) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 h-6 rounded bg-destructive/15 text-destructive border border-destructive/40 text-xs font-semibold inline-flex items-center", children: it.code }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground font-medium", children: it.description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground sm:ml-auto", children: [
      "持續 ",
      it.durationMin,
      " 分 · ",
      it.resolutionNote
    ] })
  ] }, it.id)) });
}
function WorkOrdersList({
  items
}) {
  if (items.length === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm min-w-[640px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-xs text-muted-foreground border-b border-border text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3 font-medium", children: "工單編號" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3 font-medium", children: "優先級" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3 font-medium", children: "派工時間" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3 font-medium", children: "完工時間" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3 font-medium", children: "維修人員" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3 font-medium", children: "問題" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: items.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3 text-primary font-medium", children: w.id }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("px-2 h-6 rounded text-xs font-semibold inline-flex items-center text-white", w.priority === "high" ? "bg-destructive" : w.priority === "medium" ? "bg-[#f97316]" : "bg-[#38bdf8]"), children: w.priority === "high" ? "高" : w.priority === "medium" ? "中" : "低" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3 text-xs text-muted-foreground", children: fmtDateTime(w.dispatchedAt) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3 text-xs text-muted-foreground", children: fmtDateTime(w.completedAt) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3 text-foreground", children: w.technician }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3 text-foreground", children: w.issueDesc })
    ] }, w.id)) })
  ] }) });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DeviceDetail, {}) });
export {
  SplitComponent as component
};
