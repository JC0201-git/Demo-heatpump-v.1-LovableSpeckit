import { K as jsxRuntimeExports } from "./server-CzeLhqbS.js";
import { g as cn } from "./app-shell-BIbYDl8S.js";
function PageHeader({
  title,
  description,
  actions
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end gap-3 sm:justify-between mb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-foreground tracking-tight", children: title }),
      description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: description })
    ] }),
    actions && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 flex-wrap", children: actions })
  ] });
}
function MetricCard({
  label,
  value,
  unit,
  trend,
  hint,
  accent,
  icon
}) {
  const accentBar = {
    ok: "bg-[#22c55e]",
    error: "bg-[#ef4444]",
    warn: "bg-[#f97316]",
    primary: "bg-primary"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-card border border-border rounded-lg p-4 overflow-hidden", children: [
    accent && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("absolute left-0 top-0 bottom-0 w-1", accentBar[accent]) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-medium", children: label }),
      icon
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-baseline gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-foreground tabular-nums", children: value }),
      unit && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: unit })
    ] }),
    (trend || hint) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex items-center gap-2", children: [
      trend && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: cn(
            "text-[11px] font-semibold",
            trend.dir === "up" ? "text-[#ef4444]" : trend.dir === "down" ? "text-[#22c55e]" : "text-muted-foreground"
          ),
          children: [
            trend.dir === "up" ? "↑" : trend.dir === "down" ? "↓" : "→",
            " ",
            trend.text
          ]
        }
      ),
      hint && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: hint })
    ] })
  ] });
}
function Section({
  title,
  children,
  actions,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "bg-card border border-border rounded-lg p-4 sm:p-5",
        className
      ),
      children: [
        (title || actions) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4 gap-2", children: [
          title && /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: title }),
          actions
        ] }),
        children
      ]
    }
  );
}
function EmptyState({ text = "暫無資料" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-10 text-sm text-muted-foreground", children: text });
}
export {
  EmptyState as E,
  MetricCard as M,
  PageHeader as P,
  Section as S
};
