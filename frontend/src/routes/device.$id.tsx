import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceDot,
  BarChart,
  Bar,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { PageHeader, MetricCard, Section, EmptyState } from "@/components/ui-bits";
import { StatusBadge } from "@/components/badges";
import { useAppState } from "@/lib/app-state";
import { genDailyPoints, genIncidents, genWorkOrders } from "@/lib/mocks/data";
import { fmtDateTime } from "@/lib/format";
import { ChevronLeft, Thermometer, Gauge, Zap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/device/$id")({
  component: () => (
    <AppShell>
      <DeviceDetail />
    </AppShell>
  ),
});

const TABS = [
  { key: "power", label: "用電紀錄" },
  { key: "operation", label: "運轉紀錄" },
  { key: "incidents", label: "異常紀錄" },
  { key: "workorders", label: "維修紀錄" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

function DeviceDetail() {
  const { id } = useParams({ from: "/device/$id" });
  const { devices } = useAppState();
  const device = devices.find((d) => d.id === id);
  const [tab, setTab] = useState<TabKey>("power");

  if (!device) {
    return (
      <div className="p-8">
        <p className="text-sm text-muted-foreground">找不到設備 {id}</p>
        <Link
          to="/overview"
          className="text-primary hover:underline mt-2 inline-block"
        >
          ← 返回總覽
        </Link>
      </div>
    );
  }

  const installedDaysAgo = Math.floor(
    (Date.now() - new Date(device.installedAt).getTime()) / 86400_000,
  );
  const days = Math.min(30, installedDaysAgo);
  const points = useMemo(() => genDailyPoints(device.id, days), [device.id, days]);
  const incidents = useMemo(() => genIncidents(device.id), [device.id]);
  const workOrders = useMemo(() => genWorkOrders(device.id), [device.id]);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <Link
          to="/overview"
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> 返回設備總覽
        </Link>
      </div>

      <PageHeader
        title={`${device.code}　${device.clientName}`}
        description={`型號 ${device.model} · ${device.location} · 安裝於 ${device.installedAt.slice(0, 10)}（${installedDaysAgo} 天）`}
        actions={<StatusBadge status={device.status} />}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          label="出水溫度"
          value={device.status === "offline" ? "--" : device.outletTemp.toFixed(1)}
          unit="°C"
          icon={<Thermometer className="w-4 h-4 text-primary" />}
        />
        <MetricCard
          label="回水溫度"
          value={device.status === "offline" ? "--" : device.inletTemp.toFixed(1)}
          unit="°C"
          icon={<Thermometer className="w-4 h-4 text-[#38bdf8]" />}
        />
        <MetricCard
          label="環境溫度"
          value={device.status === "offline" ? "--" : device.ambientTemp.toFixed(1)}
          unit="°C"
        />
        <MetricCard
          label="即時功率"
          value={device.status === "offline" ? "--" : device.powerKW.toFixed(2)}
          unit="kW"
          icon={<Zap className="w-4 h-4 text-[#f97316]" />}
          accent={device.powerKW > 22 ? "warn" : undefined}
        />
        <MetricCard
          label="COP 效率"
          value={device.status === "offline" ? "--" : device.cop.toFixed(2)}
          icon={<Gauge className="w-4 h-4 text-primary" />}
          accent={device.cop > 0 && device.cop < 2.8 ? "error" : "ok"}
        />
        <MetricCard
          label="累積運轉"
          value={device.totalRunHours.toLocaleString()}
          unit="hr"
          icon={<Activity className="w-4 h-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="壓縮機" value={device.compressorOn ? "運轉中" : "停機"} accent={device.compressorOn ? "ok" : undefined} />
        <MetricCard label="水泵" value={device.pumpOn ? "運轉中" : "停機"} accent={device.pumpOn ? "ok" : undefined} />
        <MetricCard label="今日能耗" value={device.todayKWh.toFixed(1)} unit="kWh" />
        <MetricCard label="風險分數" value={device.riskScore} accent={device.riskScore >= 70 ? "error" : device.riskScore >= 40 ? "warn" : "ok"} hint={device.riskReason} />
      </div>

      <Section>
        <div className="flex gap-1 mb-4 border-b border-border overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "px-3 sm:px-4 h-9 text-sm whitespace-nowrap transition-colors focus-ring rounded-t",
                tab === t.key
                  ? "text-primary border-b-2 border-primary font-semibold -mb-px"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {installedDaysAgo < 30 && (
          <div className="mb-3 text-xs text-muted-foreground italic">
            資料期間：{device.installedAt.slice(0, 10)} ～ 今日（共 {installedDaysAgo} 天，未滿 30 天）
          </div>
        )}

        {tab === "power" && <PowerChart points={points} />}
        {tab === "operation" && <OperationChart points={points} />}
        {tab === "incidents" && <IncidentsList items={incidents} />}
        {tab === "workorders" && <WorkOrdersList items={workOrders} />}
      </Section>
    </div>
  );
}

function PowerChart({ points }: { points: ReturnType<typeof genDailyPoints> }) {
  if (points.length === 0) return <EmptyState />;
  const anomalies = points.filter((p) => p.anomaly);
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 16, left: 4, bottom: 4 }}>
          <CartesianGrid stroke="#ffffff10" />
          <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickFormatter={(d) => d.slice(5)} />
          <YAxis stroke="#9ca3af" fontSize={10} unit=" kWh" />
          <Tooltip
            contentStyle={{
              background: "#0a1814",
              border: "1px solid #ffffff20",
              borderRadius: 6,
              fontSize: 12,
            }}
            labelStyle={{ color: "#a3e635" }}
            formatter={(v: number, _n, p: any) => [
              `${v} kWh${p?.payload?.anomaly ? " · 異常" : ""}`,
              "用電量",
            ]}
          />
          <Line
            type="monotone"
            dataKey="kWh"
            stroke="#a3e635"
            strokeWidth={2}
            dot={false}
          />
          {anomalies.map((a) => (
            <ReferenceDot
              key={a.date}
              x={a.date}
              y={a.kWh}
              r={5}
              fill="#ef4444"
              stroke="#fff"
              strokeWidth={1}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function OperationChart({ points }: { points: ReturnType<typeof genDailyPoints> }) {
  const totalHours = points.reduce((s, p) => s + p.runHours, 0);
  const totalStarts = points.reduce((s, p) => s + p.starts, 0);
  const avgCop = points.reduce((s, p) => s + p.cop, 0) / Math.max(1, points.length);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="期間累計運轉" value={totalHours.toFixed(1)} unit="hr" />
        <MetricCard label="期間總開機次數" value={totalStarts} unit="次" />
        <MetricCard label="平均 COP" value={avgCop.toFixed(2)} accent={avgCop < 2.8 ? "error" : "ok"} />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points}>
            <CartesianGrid stroke="#ffffff10" />
            <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickFormatter={(d) => d.slice(5)} />
            <YAxis stroke="#9ca3af" fontSize={10} />
            <Tooltip
              contentStyle={{ background: "#0a1814", border: "1px solid #ffffff20", borderRadius: 6, fontSize: 12 }}
            />
            <Line type="monotone" dataKey="cop" stroke="#38bdf8" strokeWidth={2} dot={false} name="COP" />
            <Line type="monotone" dataKey="runHours" stroke="#a3e635" strokeWidth={2} dot={false} name="運轉時數" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function IncidentsList({ items }: { items: ReturnType<typeof genIncidents> }) {
  if (items.length === 0) return <EmptyState />;
  return (
    <div className="space-y-2">
      {items.map((it) => (
        <div
          key={it.id}
          className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-background rounded border border-border"
        >
          <div className="text-xs text-muted-foreground w-36 flex-shrink-0">
            {fmtDateTime(it.occurredAt)}
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 h-6 rounded bg-destructive/15 text-destructive border border-destructive/40 text-xs font-semibold inline-flex items-center">
              {it.code}
            </span>
            <span className="text-sm text-foreground font-medium">{it.description}</span>
          </div>
          <div className="text-xs text-muted-foreground sm:ml-auto">
            持續 {it.durationMin} 分 · {it.resolutionNote}
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkOrdersList({ items }: { items: ReturnType<typeof genWorkOrders> }) {
  if (items.length === 0) return <EmptyState />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="text-xs text-muted-foreground border-b border-border text-left">
            <th className="py-2 px-3 font-medium">工單編號</th>
            <th className="py-2 px-3 font-medium">優先級</th>
            <th className="py-2 px-3 font-medium">派工時間</th>
            <th className="py-2 px-3 font-medium">完工時間</th>
            <th className="py-2 px-3 font-medium">維修人員</th>
            <th className="py-2 px-3 font-medium">問題</th>
          </tr>
        </thead>
        <tbody>
          {items.map((w) => (
            <tr key={w.id} className="border-b border-border/50">
              <td className="py-2 px-3 text-primary font-medium">{w.id}</td>
              <td className="py-2 px-3">
                <span
                  className={cn(
                    "px-2 h-6 rounded text-xs font-semibold inline-flex items-center text-white",
                    w.priority === "high"
                      ? "bg-destructive"
                      : w.priority === "medium"
                        ? "bg-[#f97316]"
                        : "bg-[#38bdf8]",
                  )}
                >
                  {w.priority === "high" ? "高" : w.priority === "medium" ? "中" : "低"}
                </span>
              </td>
              <td className="py-2 px-3 text-xs text-muted-foreground">{fmtDateTime(w.dispatchedAt)}</td>
              <td className="py-2 px-3 text-xs text-muted-foreground">{fmtDateTime(w.completedAt)}</td>
              <td className="py-2 px-3 text-foreground">{w.technician}</td>
              <td className="py-2 px-3 text-foreground">{w.issueDesc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
