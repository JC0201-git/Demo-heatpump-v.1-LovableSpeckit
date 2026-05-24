import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader, Section, MetricCard } from "@/components/ui-bits";
import { SeverityBadge, AlertStatusBadge } from "@/components/badges";
import { useAppState } from "@/lib/app-state";
import {
  ALERT_TYPE_OPTIONS,
  TECH_NAME_OPTIONS,
  systemSettings,
} from "@/lib/mocks/data";
import { fmtDateTime, severityRank, ALERT_STATUS_LABEL } from "@/lib/format";
import type { AlertItem, AlertStatus } from "@/lib/mocks/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alerts")({
  component: () => (
    <AppShell>
      <Alerts />
    </AppShell>
  ),
});

function Alerts() {
  const { alerts, assignAlert, resolveAlert } = useAppState();
  const [statusFilter, setStatusFilter] = useState<AlertStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<string | "all">("all");

  const stats = useMemo(() => {
    const s = { open: 0, in_progress: 0, resolved: 0, overdue: 0 };
    alerts.forEach((a) => {
      s[a.status]++;
      if (
        a.status !== "resolved" &&
        (Date.now() - new Date(a.occurredAt).getTime()) / 3600_000 >
          systemSettings.ALERT_OVERDUE_HOURS
      ) {
        s.overdue++;
      }
    });
    return s;
  }, [alerts]);

  const filtered = useMemo(() => {
    return alerts
      .filter((a) => (statusFilter === "all" ? true : a.status === statusFilter))
      .filter((a) => (typeFilter === "all" ? true : a.type === typeFilter))
      .sort((a, b) => {
        // unassigned first
        const ua = a.assignee === null && a.status !== "resolved" ? 0 : 1;
        const ub = b.assignee === null && b.status !== "resolved" ? 0 : 1;
        if (ua !== ub) return ua - ub;
        const sr = severityRank(a.severity) - severityRank(b.severity);
        if (sr !== 0) return sr;
        return b.occurredAt.localeCompare(a.occurredAt);
      });
  }, [alerts, statusFilter, typeFilter]);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader
        title="告警中心"
        description="集中管理所有設備即時告警，未指派告警優先置頂；逾時門檻 24 小時。"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="未處理" value={stats.open} unit="筆" accent="error" />
        <MetricCard label="處理中" value={stats.in_progress} unit="筆" accent="warn" />
        <MetricCard label="已解除" value={stats.resolved} unit="筆" accent="ok" />
        <MetricCard
          label={`逾時 (>${systemSettings.ALERT_OVERDUE_HOURS}h)`}
          value={stats.overdue}
          unit="筆"
          accent={stats.overdue > 0 ? "error" : undefined}
        />
      </div>

      <Section
        title="告警列表"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-8 px-2 text-xs rounded-md bg-background border border-border text-foreground focus-ring"
            >
              <option value="all">所有狀態</option>
              <option value="open">{ALERT_STATUS_LABEL.open}</option>
              <option value="in_progress">{ALERT_STATUS_LABEL.in_progress}</option>
              <option value="resolved">{ALERT_STATUS_LABEL.resolved}</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-8 px-2 text-xs rounded-md bg-background border border-border text-foreground focus-ring"
            >
              <option value="all">所有類型</option>
              {ALERT_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        }
      >
        <div className="space-y-2">
          {filtered.map((a) => (
            <AlertRow
              key={a.id}
              alert={a}
              onAssign={(who) => assignAlert(a.id, who)}
              onResolve={() => resolveAlert(a.id, "現場處理完成")}
            />
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8">
              暫無符合條件的告警
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}

function AlertRow({
  alert,
  onAssign,
  onResolve,
}: {
  alert: AlertItem;
  onAssign: (name: string) => void;
  onResolve: () => void;
}) {
  const overdue =
    alert.status !== "resolved" &&
    (Date.now() - new Date(alert.occurredAt).getTime()) / 3600_000 >
      systemSettings.ALERT_OVERDUE_HOURS;

  return (
    <div
      className={cn(
        "border rounded-md p-3 flex flex-col lg:flex-row lg:items-center gap-3 transition-colors",
        alert.severity === "high"
          ? "bg-destructive/10 border-destructive/40"
          : "bg-background border-border hover:bg-accent/40",
      )}
    >
      <div className="flex items-center gap-2 lg:w-64">
        <SeverityBadge severity={alert.severity} />
        <AlertStatusBadge status={alert.status} />
        {overdue && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive text-white font-semibold">
            逾時
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap text-sm">
          <span className="font-semibold text-foreground">{alert.deviceCode}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-foreground">{alert.clientName}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-foreground">{alert.type}</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          發生 {fmtDateTime(alert.occurredAt)}
          {alert.assignedAt && ` · 指派 ${fmtDateTime(alert.assignedAt)}`}
          {alert.resolvedAt && ` · 解除 ${fmtDateTime(alert.resolvedAt)}`}
          {alert.assignee && ` · 負責人 ${alert.assignee}`}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {alert.status === "open" && (
          <select
            defaultValue=""
            onChange={(e) => e.target.value && onAssign(e.target.value)}
            className="h-8 px-2 text-xs rounded-md bg-background border border-border text-foreground focus-ring"
          >
            <option value="" disabled>
              指派負責人…
            </option>
            {TECH_NAME_OPTIONS.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        )}
        {alert.status !== "resolved" && (
          <button
            onClick={onResolve}
            className="h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 focus-ring"
          >
            標記已解除
          </button>
        )}
      </div>
    </div>
  );
}
