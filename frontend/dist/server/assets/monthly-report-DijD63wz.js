import { K as jsxRuntimeExports, T as reactExports } from "./server-CzeLhqbS.js";
import { b as AppShell, u as useAppState, m as systemSettings } from "./app-shell-BIbYDl8S.js";
import { P as PageHeader, M as MetricCard, S as Section } from "./ui-bits--3L9Te_T.js";
import { c as createLucideIcon } from "./activity-F8GmJbQr.js";
import { e as ResponsiveContainer, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, B as Bar, a as Cell } from "./generateCategoricalChart-5mld-MbB.js";
import { B as BarChart } from "./BarChart-C81iLmsw.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-sZOWJ7Yg.js";
const __iconNode$1 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$1);
const __iconNode = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode);
function MonthlyReport() {
  const {
    devices,
    alerts
  } = useAppState();
  const now = /* @__PURE__ */ new Date();
  const [month, setMonth] = reactExports.useState(`${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`);
  const reportRef = reactExports.useRef(null);
  const [exporting, setExporting] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(0);
  const [year, monthN] = month.split("-").map(Number);
  const daysInMonth = new Date(year, monthN, 0).getDate();
  const healthBuckets = reactExports.useMemo(() => {
    const buckets = [{
      range: "0-20",
      count: 0
    }, {
      range: "21-40",
      count: 0
    }, {
      range: "41-60",
      count: 0
    }, {
      range: "61-80",
      count: 0
    }, {
      range: "81-100",
      count: 0
    }];
    devices.forEach((d) => {
      const health = 100 - d.riskScore;
      if (health <= 20) buckets[0].count++;
      else if (health <= 40) buckets[1].count++;
      else if (health <= 60) buckets[2].count++;
      else if (health <= 80) buckets[3].count++;
      else buckets[4].count++;
    });
    return buckets;
  }, [devices]);
  const avgHealth = reactExports.useMemo(() => devices.reduce((s, d) => s + (100 - d.riskScore), 0) / devices.length, [devices]);
  const monthAlerts = reactExports.useMemo(() => alerts.filter((a) => a.occurredAt.startsWith(month)), [alerts, month]);
  const alertTypeStats = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    monthAlerts.forEach((a) => map.set(a.type, (map.get(a.type) || 0) + 1));
    return [...map.entries()].map(([type, count]) => ({
      type,
      count
    })).sort((a, b) => b.count - a.count);
  }, [monthAlerts]);
  const top5Devices = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    monthAlerts.forEach((a) => {
      const cur = map.get(a.deviceId) || {
        code: a.deviceCode,
        count: 0
      };
      cur.count++;
      map.set(a.deviceId, cur);
    });
    return [...map.values()].sort((a, b) => b.count - a.count || a.code.localeCompare(b.code)).slice(0, 5);
  }, [monthAlerts]);
  const resolvedCount = monthAlerts.filter((a) => a.status === "resolved").length;
  const resolveRate = monthAlerts.length === 0 ? 0 : resolvedCount / monthAlerts.length * 100;
  const overdueCount = monthAlerts.filter((a) => a.status !== "resolved" && (Date.now() - new Date(a.occurredAt).getTime()) / 36e5 > systemSettings.ALERT_OVERDUE_HOURS).length;
  const avgResolveHr = reactExports.useMemo(() => {
    const resolved = monthAlerts.filter((a) => a.resolvedAt);
    if (resolved.length === 0) return 0;
    const total = resolved.reduce((s, a) => s + (new Date(a.resolvedAt).getTime() - new Date(a.occurredAt).getTime()) / 36e5, 0);
    return total / resolved.length;
  }, [monthAlerts]);
  async function exportPdf() {
    if (!reportRef.current) return;
    setExporting(true);
    setProgress(10);
    const [{
      default: html2canvas
    }, {
      default: jsPDF
    }] = await Promise.all([import("./html2canvas.esm-C17pzFXx.js"), import("./jspdf.es.min-D3r9s-pa.js").then((n) => n.j)]);
    setProgress(40);
    const canvas = await html2canvas(reportRef.current, {
      backgroundColor: "#0d1f1a",
      scale: 2,
      useCORS: true
    });
    setProgress(75);
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    });
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const usableW = pageWidth - margin * 2;
    const usableH = pageHeight - margin * 2;
    const ratio = canvas.height / canvas.width;
    const imgW = usableW;
    const imgH = imgW * ratio;
    if (imgH <= usableH) {
      pdf.addImage(img, "PNG", margin, margin, imgW, imgH);
    } else {
      let position = 0;
      const pageCanvas = document.createElement("canvas");
      const ctx = pageCanvas.getContext("2d");
      const sliceHeightPx = usableH / imgW * canvas.width;
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeightPx;
      let page = 0;
      while (position < canvas.height) {
        ctx.fillStyle = "#0d1f1a";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(canvas, 0, -position);
        const pageImg = pageCanvas.toDataURL("image/png");
        if (page > 0) pdf.addPage();
        pdf.addImage(pageImg, "PNG", margin, margin, imgW, usableH);
        position += sliceHeightPx;
        page++;
      }
    }
    setProgress(95);
    pdf.save(`monthly-report-${month}.pdf`);
    setProgress(100);
    setTimeout(() => setExporting(false), 500);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "月度設備健康報告", description: "提供主管彙整每月設備健康概況、異常統計與告警處理狀態。", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "month", value: month, onChange: (e) => setMonth(e.target.value), className: "h-9 px-3 text-sm rounded-md bg-background border border-border text-foreground focus-ring" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: exportPdf, disabled: exporting, className: "h-9 px-3 text-sm rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 focus-ring inline-flex items-center gap-1.5 disabled:opacity-60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
        " 匯出 PDF"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: reportRef, className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "平均健康分數", value: avgHealth.toFixed(1), unit: "分", accent: avgHealth >= 70 ? "ok" : avgHealth >= 40 ? "warn" : "error", hint: `管理設備 ${devices.length} 台` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "本月告警總數", value: monthAlerts.length, unit: "筆", hint: `每日均 ${(monthAlerts.length / daysInMonth).toFixed(1)} 筆` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "已解除率", value: resolveRate.toFixed(1), unit: "%", accent: resolveRate >= 80 ? "ok" : "warn", hint: `已解除 ${resolvedCount} / ${monthAlerts.length}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "平均解除時間", value: avgResolveHr.toFixed(1), unit: "小時", hint: `逾時 ${overdueCount} 筆`, accent: overdueCount > 0 ? "error" : "ok" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "設備健康分數分布（直方圖）", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: healthBuckets, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "#ffffff10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "range", stroke: "#9ca3af", fontSize: 11 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "#9ca3af", fontSize: 11, allowDecimals: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            background: "#0a1814",
            border: "1px solid #ffffff20",
            borderRadius: 6,
            fontSize: 12
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "count", radius: [4, 4, 0, 0], children: healthBuckets.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: i <= 1 ? "#ef4444" : i === 2 ? "#f97316" : i === 3 ? "#38bdf8" : "#a3e635" }, i)) })
        ] }) }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "異常類型分布", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: alertTypeStats, layout: "vertical", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "#ffffff10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { type: "number", stroke: "#9ca3af", fontSize: 11, allowDecimals: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { type: "category", dataKey: "type", stroke: "#9ca3af", fontSize: 11, width: 88 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            background: "#0a1814",
            border: "1px solid #ffffff20",
            borderRadius: 6,
            fontSize: 12
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "count", fill: "#a3e635", radius: [0, 4, 4, 0] })
        ] }) }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "本月異常 Top 5 設備", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm min-w-[420px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-xs text-muted-foreground border-b border-border text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3 font-medium", children: "排名" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3 font-medium", children: "設備編號" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3 font-medium text-right", children: "異常次數" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3 font-medium text-right", children: "每日平均" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          top5Devices.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3 font-bold text-primary", children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3 text-foreground", children: d.code }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3 text-right tabular-nums", children: d.count }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3 text-right tabular-nums text-muted-foreground", children: (d.count / daysInMonth).toFixed(2) })
          ] }, d.code)),
          top5Devices.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "py-6 text-center text-muted-foreground", children: "本月無告警紀錄" }) })
        ] })
      ] }) }) })
    ] }),
    exporting && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed bottom-4 right-4 bg-card border border-border rounded-md shadow-lg px-4 py-3 flex items-center gap-3 z-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-foreground font-semibold", children: [
          "匯出中 ",
          progress,
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-40 h-1 bg-secondary rounded overflow-hidden mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-primary transition-all", style: {
          width: `${progress}%`
        } }) })
      ] })
    ] })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(MonthlyReport, {}) });
export {
  SplitComponent as component
};
