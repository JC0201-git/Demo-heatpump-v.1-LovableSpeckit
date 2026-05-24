import { K as jsxRuntimeExports, T as reactExports } from "./server-CzeLhqbS.js";
import { L as Link } from "./router-sZOWJ7Yg.js";
import { b as AppShell, u as useAppState, r as recommendedAction, g as cn } from "./app-shell-BIbYDl8S.js";
import { P as PageHeader, S as Section } from "./ui-bits--3L9Te_T.js";
import { c as createLucideIcon } from "./activity-F8GmJbQr.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$2 = [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
];
const ArrowDown = createLucideIcon("arrow-down", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
];
const ArrowUp = createLucideIcon("arrow-up", __iconNode$1);
const __iconNode = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode);
function Risk() {
  const {
    devices
  } = useAppState();
  const top10 = reactExports.useMemo(() => [...devices].sort((a, b) => b.riskScore - a.riskScore).slice(0, 10), [devices]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "風險排序 Top 10", description: "依據健康分數、近期告警與保養紀錄綜合計算，協助主管優先派工。" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: top10.map((d, idx) => {
      const action = recommendedAction(d.riskScore);
      const rank = idx + 1;
      const change = d.rankChange;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/device/$id", params: {
        id: d.id
      }, className: "flex items-center gap-3 sm:gap-4 p-3 rounded-md bg-background hover:bg-accent/50 transition-colors focus-ring border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("w-10 h-10 rounded-md flex items-center justify-center font-bold text-base flex-shrink-0", rank <= 3 ? "bg-destructive text-white" : "bg-secondary text-primary"), children: rank }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: d.code }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: d.clientName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground hidden sm:inline", children: [
              "· ",
              d.location
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1 truncate", children: [
            "主因：",
            d.riskReason
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 sm:gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "風險分數" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold tabular-nums text-destructive", children: d.riskScore })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex flex-col items-center w-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "排名變動" }),
            change === "up" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "w-5 h-5 text-destructive" }) : change === "down" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "w-5 h-5 text-[#22c55e]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-5 h-5 text-muted-foreground" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("hidden md:inline-flex items-center px-2 h-7 rounded text-xs font-semibold", action.level === "緊急" ? "bg-destructive/15 text-destructive border border-destructive/40" : action.level === "本週" ? "bg-[#f97316]/15 text-[#f97316] border border-[#f97316]/40" : "bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/40"), children: action.label })
        ] })
      ] }, d.id);
    }) }) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Risk, {}) });
export {
  SplitComponent as component
};
