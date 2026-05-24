import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useAppState } from "@/lib/app-state";
import { STATUS_LABEL, STATUS_COLOR, fmtRelative } from "@/lib/format";
import type { Device, DeviceStatus } from "@/lib/mocks/types";
import {
  Search,
  Activity,
  AlertOctagon,
  WifiOff,
  Wrench,
  ChevronDown,
  Maximize2,
  Info,
  Map as MapIcon,
  GitBranch,
  Gauge,
  Zap,
  Thermometer,
  Timer,
  CircleDot,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

export const Route = createFileRoute("/overview")({
  component: () => (
    <AppShell>
      <Overview />
    </AppShell>
  ),
});

const FILTERS: (DeviceStatus | "all")[] = ["all", "normal", "abnormal", "offline", "maintenance"];
const FILTER_LABEL: Record<string, string> = { all: "全部", ...STATUS_LABEL };

// Deterministic timeline hours (avoid hydration drift)
const TIMELINE = Array.from({ length: 12 }, (_, i) => {
  const h = 8 + Math.floor((i * 5) / 60);
  const m = (i * 5) % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
});

// Deterministic workflow curve
const WORKFLOW = Array.from({ length: 32 }, (_, i) => {
  const base = 140 + Math.sin(i / 3) * 25 + (i % 5) * 4;
  return {
    t: (1 + i * 0.05).toFixed(2),
    v: Math.round(base),
    bar: Math.round(20 + ((i * 7) % 40)),
  };
});

function Overview() {
  const { devices } = useAppState();
  const [filter, setFilter] = useState<DeviceStatus | "all">("all");
  const [q, setQ] = useState("");
  const [view, setView] = useState<"top" | "iso">("iso");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const s = { normal: 0, abnormal: 0, offline: 0, maintenance: 0 };
    devices.forEach((d) => s[d.status]++);
    return s;
  }, [devices]);

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return devices.filter((d) => {
      if (filter !== "all" && d.status !== filter) return false;
      if (kw) {
        const hit =
          d.code.toLowerCase().includes(kw) ||
          d.clientName.toLowerCase().includes(kw) ||
          d.location.toLowerCase().includes(kw);
        if (!hit) return false;
      }
      return true;
    });
  }, [devices, filter, q]);

  // Page slice for the topology grid (mimic factory layout)
  const tiles = filtered.slice(0, 28);
  const selected =
    devices.find((d) => d.id === selectedId) ?? tiles[Math.floor(tiles.length / 2)] ?? devices[0];

  return (
    <div className="px-4 sm:px-6 py-4 space-y-4">
      {/* Top strip: zone selector + timeline */}
      <div className="flex items-center gap-3 bg-card/60 border border-border rounded-lg p-2 sm:p-3 backdrop-blur">
        <div className="flex items-center gap-2 px-3 h-10 rounded-md bg-background border border-border min-w-[150px]">
          <CircleDot className="w-4 h-4 text-primary" />
          <div className="text-[10px] text-muted-foreground leading-tight">
            Zone
            <div className="text-sm text-foreground font-semibold leading-tight">
              全廠區 — Z1
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
        </div>

        <div className="flex-1 overflow-x-auto">
          <div className="flex items-end h-10 min-w-[680px] relative">
            {TIMELINE.map((t, i) => {
              const active = i >= 4 && i <= 8;
              const dotColor =
                i % 5 === 0 ? "#ef4444" : i % 3 === 0 ? "#f97316" : "#22c55e";
              return (
                <div
                  key={t}
                  className={cn(
                    "flex-1 h-full relative flex flex-col items-center justify-end pb-1 border-r border-border/40",
                    active && "bg-primary/15",
                  )}
                >
                  <span
                    className="absolute top-1 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: dotColor }}
                  />
                  <span
                    className={cn(
                      "text-[11px] tabular-nums",
                      active ? "text-primary font-semibold" : "text-muted-foreground",
                    )}
                  >
                    {t}
                  </span>
                </div>
              );
            })}
            {/* highlight bracket */}
            <div className="absolute inset-y-0 left-[33.3%] w-[41.6%] border border-primary/60 rounded pointer-events-none" />
          </div>
        </div>

        <button className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground hover:opacity-90">
          <TrendingUp className="w-4 h-4" />
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatPill label="正常運轉" value={stats.normal} color="#22c55e" icon={<Activity className="w-4 h-4" />} />
        <StatPill label="異常告警" value={stats.abnormal} color="#ef4444" icon={<AlertOctagon className="w-4 h-4" />} pulse />
        <StatPill label="待維修" value={stats.maintenance} color="#f97316" icon={<Wrench className="w-4 h-4" />} />
        <StatPill label="離線" value={stats.offline} color="#6b7280" icon={<WifiOff className="w-4 h-4" />} />
      </div>

      {/* Main: topology + side panels */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Topology canvas */}
        <div className="xl:col-span-3 relative rounded-xl border border-border bg-[radial-gradient(ellipse_at_center,#13302a_0%,#0a1814_70%)] overflow-hidden">
          {/* Toolbar */}
          <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="搜尋設備編號／客戶／地點"
                className="h-8 w-full pl-7 pr-2 text-xs rounded-md bg-background/80 border border-border focus-ring text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex bg-background/80 border border-border rounded-md p-0.5">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-2.5 h-7 rounded text-xs transition-colors focus-ring",
                    filter === f
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {FILTER_LABEL[f]}
                </button>
              ))}
            </div>
            <div className="ml-auto flex bg-background/80 border border-border rounded-md p-0.5">
              <button
                onClick={() => setView("top")}
                className={cn(
                  "px-2.5 h-7 rounded text-xs",
                  view === "top"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Top View
              </button>
              <button
                onClick={() => setView("iso")}
                className={cn(
                  "px-2.5 h-7 rounded text-xs",
                  view === "iso"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                3D View
              </button>
            </div>
          </div>

          {/* grid background */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(163,230,53,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(163,230,53,0.08) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />

          {/* Isometric tile grid */}
          <div className="relative pt-16 pb-10 px-4 min-h-[520px] flex items-center justify-center">
            <div
              className={cn(
                "grid gap-3 sm:gap-4",
                view === "iso" && "[transform:rotateX(54deg)_rotateZ(-45deg)] [transform-style:preserve-3d]",
              )}
              style={{
                gridTemplateColumns: "repeat(7, minmax(64px,86px))",
              }}
            >
              {tiles.map((d) => (
                <DeviceTile
                  key={d.id}
                  d={d}
                  selected={selected?.id === d.id}
                  iso={view === "iso"}
                  onClick={() => setSelectedId(d.id)}
                />
              ))}
            </div>

            {/* Floating tooltip for selected */}
            {selectedId && selected && (
              <div className="absolute z-10 w-[260px] bg-card/95 border border-border rounded-lg shadow-2xl backdrop-blur pointer-events-auto" style={{ right: "32px", bottom: "36px" }}>
                <div className="flex items-center gap-2 px-3 h-9 border-b border-border bg-primary/10 rounded-t-lg">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: STATUS_COLOR[selected.status] }}
                  />
                  <span className="text-xs font-semibold text-foreground truncate">
                    {selected.code} · {selected.clientName}
                  </span>
                  <Link
                    to="/device/$id"
                    params={{ id: selected.id }}
                    className="ml-auto text-[10px] text-primary hover:underline"
                  >
                    詳情 →
                  </Link>
                </div>
                <div className="px-3 py-2 grid grid-cols-2 gap-y-1.5 text-[12px]">
                  <TooltipRow label="出水溫" value={`${selected.outletTemp.toFixed(1)} °C`} />
                  <TooltipRow label="回水溫" value={`${selected.inletTemp.toFixed(1)} °C`} />
                  <TooltipRow label="功率" value={`${selected.powerKW.toFixed(1)} kW`} />
                  <TooltipRow label="COP" value={selected.cop.toFixed(2)} />
                  <TooltipRow label="今日能耗" value={`${selected.todayKWh.toFixed(0)} kWh`} />
                  <TooltipRow
                    label="壓縮機"
                    value={selected.compressorOn ? "ON" : "OFF"}
                    color={selected.compressorOn ? "#22c55e" : "#6b7280"}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bottom legend */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-3">
              {(["normal", "abnormal", "maintenance", "offline"] as DeviceStatus[]).map((s) => (
                <span key={s} className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLOR[s] }} />
                  {STATUS_LABEL[s]}
                </span>
              ))}
            </div>
            <span>顯示 {tiles.length} / {filtered.length} 台</span>
          </div>
        </div>

        {/* Right rail */}
        <div className="space-y-4">
          <SidePanel icon={<Gauge className="w-4 h-4 text-primary-foreground" />} title="即時資料總覽">
            <DataRow
              icon={<Timer className="w-3.5 h-3.5" />}
              label="累計運轉小時"
              value={`${(selected?.totalRunHours ?? 0).toLocaleString()} h`}
            />
            <DataRow
              icon={<Zap className="w-3.5 h-3.5" />}
              label="今日累計用電"
              value={`${(selected?.todayKWh ?? 0).toFixed(1)} kWh`}
            />
            <DataRow
              icon={<Activity className="w-3.5 h-3.5" />}
              label="目前 COP"
              value={(selected?.cop ?? 0).toFixed(2)}
            />
            <DataRow
              icon={<Thermometer className="w-3.5 h-3.5" />}
              label="出水 / 回水"
              value={`${selected?.outletTemp.toFixed(1) ?? "--"} / ${selected?.inletTemp.toFixed(1) ?? "--"} °C`}
            />
          </SidePanel>

          <SidePanel icon={<MapIcon className="w-4 h-4 text-primary-foreground" />} title="廠區地圖">
            <div className="relative h-[140px] rounded-md overflow-hidden bg-[#0a1814] border border-border">
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(163,230,53,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(163,230,53,0.12) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="absolute left-[18%] top-[22%] w-10 h-7 bg-primary/40 border border-primary rounded-sm" />
              <div className="absolute left-[36%] top-[44%] w-16 h-10 bg-primary/70 border border-primary rounded-sm shadow-[0_0_20px_rgba(163,230,53,0.6)]" />
              <div className="absolute right-[18%] top-[30%] w-8 h-6 bg-[#f97316]/40 border border-[#f97316] rounded-sm" />
              <div className="absolute right-[22%] bottom-[18%] w-9 h-7 bg-[#ef4444]/40 border border-[#ef4444] rounded-sm animate-pulse" />
              <span className="absolute left-2 bottom-1 text-[10px] text-muted-foreground">Line 1–4</span>
            </div>
          </SidePanel>

          <SidePanel icon={<GitBranch className="w-4 h-4 text-primary-foreground" />} title="系統拓撲">
            <div className="flex items-center gap-1.5 text-[11px]">
              <TopologyNode label="主控" tone="primary" />
              <DashLine />
              <TopologyNode label="閘道 A" tone="ok" />
              <DashLine />
              <div className="flex flex-col gap-1">
                <TopologyNode label="HP-2001" tone="ok" small />
                <TopologyNode label="HP-2002" tone="warn" small />
                <TopologyNode label="HP-2003" tone="error" small />
              </div>
            </div>
          </SidePanel>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <SidePanel
          icon={<Gauge className="w-4 h-4 text-primary-foreground" />}
          title="運轉指標"
          right={<Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />}
        >
          <div className="grid grid-cols-3 gap-2">
            <KpiTile icon={<Zap className="w-4 h-4" />} label="今日總能耗" value="12,430" unit="kWh" />
            <KpiTile icon={<Activity className="w-4 h-4" />} label="平均 COP" value="3.42" unit="" />
            <KpiTile icon={<TrendingUp className="w-4 h-4" />} label="運轉效率" value="87" unit="%" />
            <KpiTile icon={<Timer className="w-4 h-4" />} label="今日停機" value="32" unit="min" />
            <KpiTile icon={<AlertOctagon className="w-4 h-4" />} label="今日告警" value="2" unit="次" />
            <KpiTile icon={<Thermometer className="w-4 h-4" />} label="平均出水" value="55.4" unit="°C" />
          </div>
        </SidePanel>

        <SidePanel
          icon={<TrendingUp className="w-4 h-4 text-primary-foreground" />}
          title="運轉趨勢曲線"
          right={
            <div className="flex gap-1 text-[10px]">
              {["6h", "12h", "1d", "7d", "1m"].map((t, i) => (
                <span
                  key={t}
                  className={cn(
                    "px-1.5 py-0.5 rounded",
                    i === 2
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground border border-border",
                  )}
                >
                  {t}
                </span>
              ))}
            </div>
          }
        >
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WORKFLOW} margin={{ top: 4, right: 6, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="cv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a3e635" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#a3e635" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="t" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#13302a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    fontSize: 11,
                  }}
                  labelStyle={{ color: "#a3e635" }}
                />
                <Area type="monotone" dataKey="v" stroke="#a3e635" strokeWidth={2} fill="url(#cv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="h-[42px] -mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WORKFLOW} margin={{ top: 0, right: 6, left: -22, bottom: 0 }}>
                <XAxis dataKey="t" hide />
                <YAxis hide />
                <Bar dataKey="bar" fill="#f97316" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SidePanel>

        <SidePanel
          icon={<Info className="w-4 h-4 text-primary-foreground" />}
          title="設備清單"
          right={<span className="text-[10px] text-muted-foreground">{filtered.length} 台</span>}
        >
          <div className="max-h-[260px] overflow-y-auto -mr-1 pr-1 space-y-1.5">
            {filtered.slice(0, 30).map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedId(d.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 h-9 rounded-md text-left text-[12px] transition-colors focus-ring",
                  selected?.id === d.id
                    ? "bg-primary/15 border border-primary/40"
                    : "border border-transparent hover:bg-accent/40",
                )}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: STATUS_COLOR[d.status] }}
                />
                <span className="font-medium text-foreground truncate flex-1">
                  {d.code}
                </span>
                <span className="text-muted-foreground truncate hidden sm:inline max-w-[80px]">
                  {d.clientName}
                </span>
                <span className="tabular-nums text-muted-foreground" suppressHydrationWarning>
                  {fmtRelative(d.lastHeartbeatAt)}
                </span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-6 text-xs text-muted-foreground">
                暫無符合條件的設備
              </div>
            )}
          </div>
        </SidePanel>
      </div>
    </div>
  );
}

/* ---------------- subcomponents ---------------- */

function StatPill({
  label,
  value,
  color,
  icon,
  pulse,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  pulse?: boolean;
}) {
  return (
    <div className="relative bg-card border border-border rounded-lg p-3 flex items-center gap-3 overflow-hidden">
      <div
        className="w-10 h-10 rounded-md flex items-center justify-center"
        style={{ backgroundColor: `${color}22`, color }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold text-foreground tabular-nums leading-tight">
          {value}
          <span className="text-xs text-muted-foreground font-normal ml-1">台</span>
        </div>
      </div>
      {pulse && value > 0 && (
        <span
          className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: color }}
        />
      )}
      <div className="absolute right-0 bottom-0 w-20 h-10 opacity-40">
        <svg viewBox="0 0 80 40" className="w-full h-full">
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            points="0,30 10,24 20,28 30,18 40,22 50,12 60,18 70,8 80,14"
          />
        </svg>
      </div>
    </div>
  );
}

function DeviceTile({
  d,
  selected,
  iso,
  onClick,
}: {
  d: Device;
  selected: boolean;
  iso: boolean;
  onClick: () => void;
}) {
  const color = STATUS_COLOR[d.status];
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative h-16 sm:h-20 rounded-md transition-all duration-200 focus-ring",
        "border text-left",
        selected ? "scale-[1.08] z-10" : "hover:scale-[1.04]",
      )}
      style={{
        background: `linear-gradient(135deg, ${color}26, ${color}0d)`,
        borderColor: selected ? color : `${color}55`,
        boxShadow: selected
          ? `0 0 0 2px ${color}, 0 0 24px ${color}80`
          : `inset 0 0 12px ${color}33`,
      }}
      title={`${d.code} · ${STATUS_LABEL[d.status]}`}
    >
      {/* status pip */}
      <span
        className={cn(
          "absolute top-1 right-1 w-1.5 h-1.5 rounded-full",
          d.status === "abnormal" && "animate-pulse",
        )}
        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
      />
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center px-1",
          iso && "[transform:rotateZ(45deg)_rotateX(-54deg)]",
        )}
      >
        <div className="text-[10px] font-semibold text-foreground tabular-nums truncate max-w-full">
          {d.code.replace("HP-", "")}
        </div>
        <div className="text-[9px] text-muted-foreground tabular-nums">
          {d.status === "offline" ? "--" : `${d.powerKW.toFixed(1)}kW`}
        </div>
      </div>
      {/* corner label */}
      <span className="absolute -bottom-2 left-1 text-[8px] text-muted-foreground hidden sm:block">
        L{(parseInt(d.id.replace(/\D/g, ""), 10) % 4) + 1}
      </span>
    </button>
  );
}

function TooltipRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <>
      <span className="text-muted-foreground">{label}</span>
      <span
        className="tabular-nums text-right font-medium"
        style={{ color: color ?? "var(--foreground)" }}
      >
        {value}
      </span>
    </>
  );
}

function SidePanel({
  icon,
  title,
  right,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-3 h-10 border-b border-border">
        <span className="w-6 h-6 rounded bg-primary flex items-center justify-center">
          {icon}
        </span>
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <div className="ml-auto">{right ?? <Info className="w-3.5 h-3.5 text-muted-foreground" />}</div>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function DataRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-border/40 last:border-b-0">
      <span className="w-6 h-6 rounded bg-background flex items-center justify-center text-primary">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-muted-foreground leading-tight">{label}</div>
        <div className="text-sm font-semibold text-foreground tabular-nums leading-tight">
          {value}
        </div>
      </div>
    </div>
  );
}

function KpiTile({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="bg-background/60 border border-border rounded-md p-2.5">
      <div className="flex items-center gap-1.5 text-primary">{icon}</div>
      <div className="mt-1 text-[10px] text-muted-foreground leading-tight">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold text-foreground tabular-nums">{value}</span>
        {unit && <span className="text-[10px] text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

function TopologyNode({
  label,
  tone,
  small,
}: {
  label: string;
  tone: "primary" | "ok" | "warn" | "error";
  small?: boolean;
}) {
  const map = {
    primary: { bg: "#a3e635", fg: "#0d1f1a" },
    ok: { bg: "#22c55e22", fg: "#22c55e", border: "#22c55e55" },
    warn: { bg: "#f9731622", fg: "#f97316", border: "#f9731655" },
    error: { bg: "#ef444422", fg: "#ef4444", border: "#ef444455" },
  } as const;
  const c = map[tone] as { bg: string; fg: string; border?: string };
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded font-semibold whitespace-nowrap",
        small ? "h-6 px-1.5 text-[10px]" : "h-8 px-2 text-[11px]",
      )}
      style={{
        background: c.bg,
        color: c.fg,
        border: c.border ? `1px solid ${c.border}` : undefined,
      }}
    >
      {label}
    </span>
  );
}

function DashLine() {
  return (
    <span
      className="inline-block w-4 h-px"
      style={{ borderTop: "1px dashed rgba(163,230,53,0.5)" }}
    />
  );
}
