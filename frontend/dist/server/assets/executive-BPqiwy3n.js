import { K as jsxRuntimeExports, T as reactExports } from "./server-CzeLhqbS.js";
import { b as AppShell, u as useAppState, t as technicians, m as systemSettings, B as Briefcase, g as cn } from "./app-shell-BIbYDl8S.js";
import { P as PageHeader, M as MetricCard, S as Section } from "./ui-bits--3L9Te_T.js";
import { c as createLucideIcon } from "./activity-F8GmJbQr.js";
import { e as ResponsiveContainer, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, d as ReferenceLine, R as ReferenceDot } from "./generateCategoricalChart-5mld-MbB.js";
import { a as LineChart, L as Line } from "./LineChart-CaIZbaXL.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-sZOWJ7Yg.js";
const __iconNode$1 = [
  ["path", { d: "m10.852 14.772-.383.923", key: "11vil6" }],
  ["path", { d: "M13.148 14.772a3 3 0 1 0-2.296-5.544l-.383-.923", key: "1v3clb" }],
  ["path", { d: "m13.148 9.228.383-.923", key: "t2zzyc" }],
  ["path", { d: "m13.53 15.696-.382-.924a3 3 0 1 1-2.296-5.544", key: "1bxfiv" }],
  ["path", { d: "m14.772 10.852.923-.383", key: "k9m8cz" }],
  ["path", { d: "m14.772 13.148.923.383", key: "1xvhww" }],
  [
    "path",
    {
      d: "M4.5 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-.5",
      key: "tn8das"
    }
  ],
  [
    "path",
    {
      d: "M4.5 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-.5",
      key: "1g2pve"
    }
  ],
  ["path", { d: "M6 18h.01", key: "uhywen" }],
  ["path", { d: "M6 6h.01", key: "1utrut" }],
  ["path", { d: "m9.228 10.852-.923-.383", key: "1wtb30" }],
  ["path", { d: "m9.228 13.148-.923.383", key: "1a830x" }]
];
const ServerCog = createLucideIcon("server-cog", __iconNode$1);
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
function Executive() {
  const {
    devices
  } = useAppState();
  const totalDevices = devices.length;
  const techCount = technicians.length;
  const perTech = totalDevices / techCount;
  const clientStats = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    devices.forEach((d) => {
      const c = map.get(d.clientId) || {
        name: d.clientName,
        deviceCount: 0,
        avgRisk: 0,
        sum: 0
      };
      c.deviceCount++;
      c.sum += d.riskScore;
      c.avgRisk = c.sum / c.deviceCount;
      map.set(d.clientId, c);
    });
    return [...map.values()].sort((a, b) => b.avgRisk - a.avgRisk).slice(0, 5);
  }, [devices]);
  const curve = reactExports.useMemo(() => {
    const data = [];
    const baseLoad = totalDevices / (techCount * systemSettings.MAX_DEVICES_PER_TECH);
    for (let added = 0; added <= systemSettings.MAX_DEVICES_PER_TECH; added += 10) {
      const util = (totalDevices + added) / (techCount * systemSettings.MAX_DEVICES_PER_TECH) * 100;
      data.push({
        added,
        util: +Math.min(util, 130).toFixed(1)
      });
    }
    return {
      data,
      baseLoad
    };
  }, [totalDevices, techCount]);
  const currentUtil = curve.data[0]?.util ?? 0;
  const maxSafeAdd = Math.max(0, Math.floor(techCount * systemSettings.MAX_DEVICES_PER_TECH * 0.85 - totalDevices));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "老闆決策中心", description: "高層次經營儀表板 · 維運負荷、風險客戶、擴張承載一頁掌握。" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "目前管理設備數", value: totalDevices, unit: "台", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ServerCog, { className: "w-4 h-4 text-primary" }), accent: "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "維運團隊人數", value: techCount, unit: "人", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 text-[#38bdf8]" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "每人平均負責", value: perTech.toFixed(1), unit: "台 / 人", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "w-4 h-4 text-[#f97316]" }), accent: perTech > systemSettings.MAX_DEVICES_PER_TECH * 0.8 ? "warn" : "ok" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "維運負載（每人）", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: technicians.map((t) => {
        const util = t.activeWorkOrders / systemSettings.MAX_WORK_ORDERS_PER_TECH * 100;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
              t.name,
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-2", children: [
                "當前工單 ",
                t.activeWorkOrders,
                " · 本月已處理 ",
                t.monthlyClosed
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("text-xs font-semibold tabular-nums", util >= 90 ? "text-destructive" : util >= 70 ? "text-[#f97316]" : "text-primary"), children: [
              util.toFixed(0),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-secondary rounded overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-full transition-all", util >= 90 ? "bg-destructive" : util >= 70 ? "bg-[#f97316]" : "bg-primary"), style: {
            width: `${Math.min(util, 100)}%`
          } }) })
        ] }, t.id);
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "風險客戶 Top 5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: clientStats.map((c, i) => {
        const level = c.avgRisk >= 70 ? "高" : c.avgRisk >= 40 ? "中" : "低";
        const color = level === "高" ? "bg-destructive/15 text-destructive border-destructive/40" : level === "中" ? "bg-[#f97316]/15 text-[#f97316] border-[#f97316]/40" : "bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/40";
        const action = level === "高" ? "主動聯繫＋合約審查" : level === "中" ? "本週回訪" : "持續觀察";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-background rounded border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-md bg-secondary text-primary flex items-center justify-center text-sm font-bold flex-shrink-0", children: i + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground", children: c.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              "設備 ",
              c.deviceCount,
              " 台 · 平均風險 ",
              c.avgRisk.toFixed(1),
              " 分"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("px-2 h-6 rounded text-xs font-semibold inline-flex items-center border", color), children: level }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground hidden md:block", children: [
            "建議：",
            action
          ] })
        ] }, c.name);
      }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "擴張承載能力分析", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
      "目前利用率 ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-semibold", children: [
        currentUtil.toFixed(1),
        "%"
      ] }),
      "可安全新增 ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: maxSafeAdd }),
      " 台（≤85% 目標）"
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: curve.data, margin: {
      top: 8,
      right: 16,
      left: 4,
      bottom: 4
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "#ffffff10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "added", stroke: "#9ca3af", fontSize: 11, label: {
        value: "新增設備數",
        position: "insideBottom",
        offset: -2,
        fill: "#9ca3af",
        fontSize: 11
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "#9ca3af", fontSize: 11, unit: "%", domain: [0, 130], label: {
        value: "預估利用率",
        angle: -90,
        position: "insideLeft",
        fill: "#9ca3af",
        fontSize: 11
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
        background: "#0a1814",
        border: "1px solid #ffffff20",
        borderRadius: 6,
        fontSize: 12
      }, formatter: (v) => [`${v}%`, "預估利用率"], labelFormatter: (l) => `新增 ${l} 台` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ReferenceLine, { y: 85, stroke: "#f97316", strokeDasharray: "4 4", label: {
        value: "85% 安全線",
        fill: "#f97316",
        fontSize: 11,
        position: "insideTopRight"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ReferenceLine, { y: 100, stroke: "#ef4444", strokeDasharray: "4 4", label: {
        value: "100% 滿載",
        fill: "#ef4444",
        fontSize: 11,
        position: "insideTopRight"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "util", stroke: "#a3e635", strokeWidth: 2, dot: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ReferenceDot, { x: 0, y: currentUtil, r: 6, fill: "#a3e635", stroke: "#fff", strokeWidth: 2, label: {
        value: "目前",
        fill: "#a3e635",
        position: "top",
        fontSize: 11
      } })
    ] }) }) }) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Executive, {}) });
export {
  SplitComponent as component
};
