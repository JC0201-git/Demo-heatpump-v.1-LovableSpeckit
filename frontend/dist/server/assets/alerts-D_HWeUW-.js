import { K as jsxRuntimeExports, T as reactExports } from "./server-CzeLhqbS.js";
import { b as AppShell, u as useAppState, m as systemSettings, s as severityRank, A as ALERT_STATUS_LABEL, a as ALERT_TYPE_OPTIONS, h as fmtDateTime, T as TECH_NAME_OPTIONS, g as cn } from "./app-shell-BIbYDl8S.js";
import { P as PageHeader, M as MetricCard, S as Section } from "./ui-bits--3L9Te_T.js";
import { S as SeverityBadge, A as AlertStatusBadge } from "./badges-CEMelYE4.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-sZOWJ7Yg.js";
import "./activity-F8GmJbQr.js";
function Alerts() {
  const {
    alerts,
    assignAlert,
    resolveAlert
  } = useAppState();
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [typeFilter, setTypeFilter] = reactExports.useState("all");
  const stats = reactExports.useMemo(() => {
    const s = {
      open: 0,
      in_progress: 0,
      resolved: 0,
      overdue: 0
    };
    alerts.forEach((a) => {
      s[a.status]++;
      if (a.status !== "resolved" && (Date.now() - new Date(a.occurredAt).getTime()) / 36e5 > systemSettings.ALERT_OVERDUE_HOURS) {
        s.overdue++;
      }
    });
    return s;
  }, [alerts]);
  const filtered = reactExports.useMemo(() => {
    return alerts.filter((a) => statusFilter === "all" ? true : a.status === statusFilter).filter((a) => typeFilter === "all" ? true : a.type === typeFilter).sort((a, b) => {
      const ua = a.assignee === null && a.status !== "resolved" ? 0 : 1;
      const ub = b.assignee === null && b.status !== "resolved" ? 0 : 1;
      if (ua !== ub) return ua - ub;
      const sr = severityRank(a.severity) - severityRank(b.severity);
      if (sr !== 0) return sr;
      return b.occurredAt.localeCompare(a.occurredAt);
    });
  }, [alerts, statusFilter, typeFilter]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "告警中心", description: "集中管理所有設備即時告警，未指派告警優先置頂；逾時門檻 24 小時。" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "未處理", value: stats.open, unit: "筆", accent: "error" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "處理中", value: stats.in_progress, unit: "筆", accent: "warn" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "已解除", value: stats.resolved, unit: "筆", accent: "ok" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: `逾時 (>${systemSettings.ALERT_OVERDUE_HOURS}h)`, value: stats.overdue, unit: "筆", accent: stats.overdue > 0 ? "error" : void 0 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "告警列表", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "h-8 px-2 text-xs rounded-md bg-background border border-border text-foreground focus-ring", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "所有狀態" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "open", children: ALERT_STATUS_LABEL.open }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "in_progress", children: ALERT_STATUS_LABEL.in_progress }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "resolved", children: ALERT_STATUS_LABEL.resolved })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: typeFilter, onChange: (e) => setTypeFilter(e.target.value), className: "h-8 px-2 text-xs rounded-md bg-background border border-border text-foreground focus-ring", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "所有類型" }),
        ALERT_TYPE_OPTIONS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t }, t))
      ] })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      filtered.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(AlertRow, { alert: a, onAssign: (who) => assignAlert(a.id, who), onResolve: () => resolveAlert(a.id, "現場處理完成") }, a.id)),
      filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm text-muted-foreground py-8", children: "暫無符合條件的告警" })
    ] }) })
  ] });
}
function AlertRow({
  alert,
  onAssign,
  onResolve
}) {
  const overdue = alert.status !== "resolved" && (Date.now() - new Date(alert.occurredAt).getTime()) / 36e5 > systemSettings.ALERT_OVERDUE_HOURS;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("border rounded-md p-3 flex flex-col lg:flex-row lg:items-center gap-3 transition-colors", alert.severity === "high" ? "bg-destructive/10 border-destructive/40" : "bg-background border-border hover:bg-accent/40"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 lg:w-64", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: alert.severity }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertStatusBadge, { status: alert.status }),
      overdue && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded bg-destructive text-white font-semibold", children: "逾時" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: alert.deviceCode }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: alert.clientName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: alert.type })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1", children: [
        "發生 ",
        fmtDateTime(alert.occurredAt),
        alert.assignedAt && ` · 指派 ${fmtDateTime(alert.assignedAt)}`,
        alert.resolvedAt && ` · 解除 ${fmtDateTime(alert.resolvedAt)}`,
        alert.assignee && ` · 負責人 ${alert.assignee}`
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
      alert.status === "open" && /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { defaultValue: "", onChange: (e) => e.target.value && onAssign(e.target.value), className: "h-8 px-2 text-xs rounded-md bg-background border border-border text-foreground focus-ring", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: "指派負責人…" }),
        TECH_NAME_OPTIONS.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: n }, n))
      ] }),
      alert.status !== "resolved" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onResolve, className: "h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 focus-ring", children: "標記已解除" })
    ] })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Alerts, {}) });
export {
  SplitComponent as component
};
