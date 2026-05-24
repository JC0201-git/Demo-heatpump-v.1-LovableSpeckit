import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { PageHeader, MetricCard, Section } from "@/components/ui-bits";
import { useAppState } from "@/lib/app-state";
import { systemSettings, technicians } from "@/lib/mocks/data";
import { Users, ServerCog, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/executive")({
  component: () => (
    <AppShell>
      <Executive />
    </AppShell>
  ),
});

function Executive() {
  const { devices } = useAppState();
  const totalDevices = devices.length;
  const techCount = technicians.length;
  const perTech = totalDevices / techCount;

  // Risk clients (top 5)
  const clientStats = useMemo(() => {
    const map = new Map<string, { name: string; deviceCount: number; avgRisk: number; sum: number }>();
    devices.forEach((d) => {
      const c = map.get(d.clientId) || { name: d.clientName, deviceCount: 0, avgRisk: 0, sum: 0 };
      c.deviceCount++;
      c.sum += d.riskScore;
      c.avgRisk = c.sum / c.deviceCount;
      map.set(d.clientId, c);
    });
    return [...map.values()]
      .sort((a, b) => b.avgRisk - a.avgRisk)
      .slice(0, 5);
  }, [devices]);

  // Capacity curve
  const curve = useMemo(() => {
    const data: { added: number; util: number }[] = [];
    const baseLoad = totalDevices / (techCount * systemSettings.MAX_DEVICES_PER_TECH);
    for (let added = 0; added <= systemSettings.MAX_DEVICES_PER_TECH; added += 10) {
      const util =
        ((totalDevices + added) /
          (techCount * systemSettings.MAX_DEVICES_PER_TECH)) *
        100;
      data.push({ added, util: +Math.min(util, 130).toFixed(1) });
    }
    return { data, baseLoad };
  }, [totalDevices, techCount]);

  const currentUtil = curve.data[0]?.util ?? 0;
  const maxSafeAdd = Math.max(
    0,
    Math.floor(
      techCount * systemSettings.MAX_DEVICES_PER_TECH * 0.85 - totalDevices,
    ),
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader
        title="老闆決策中心"
        description="高層次經營儀表板 · 維運負荷、風險客戶、擴張承載一頁掌握。"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <MetricCard
          label="目前管理設備數"
          value={totalDevices}
          unit="台"
          icon={<ServerCog className="w-4 h-4 text-primary" />}
          accent="primary"
        />
        <MetricCard
          label="維運團隊人數"
          value={techCount}
          unit="人"
          icon={<Users className="w-4 h-4 text-[#38bdf8]" />}
        />
        <MetricCard
          label="每人平均負責"
          value={perTech.toFixed(1)}
          unit="台 / 人"
          icon={<Briefcase className="w-4 h-4 text-[#f97316]" />}
          accent={perTech > systemSettings.MAX_DEVICES_PER_TECH * 0.8 ? "warn" : "ok"}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Section title="維運負載（每人）">
          <div className="space-y-3">
            {technicians.map((t) => {
              const util = (t.activeWorkOrders / systemSettings.MAX_WORK_ORDERS_PER_TECH) * 100;
              return (
                <div key={t.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-foreground">
                      {t.name}
                      <span className="text-xs text-muted-foreground ml-2">
                        當前工單 {t.activeWorkOrders} · 本月已處理 {t.monthlyClosed}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "text-xs font-semibold tabular-nums",
                        util >= 90
                          ? "text-destructive"
                          : util >= 70
                            ? "text-[#f97316]"
                            : "text-primary",
                      )}
                    >
                      {util.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all",
                        util >= 90
                          ? "bg-destructive"
                          : util >= 70
                            ? "bg-[#f97316]"
                            : "bg-primary",
                      )}
                      style={{ width: `${Math.min(util, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="風險客戶 Top 5">
          <div className="space-y-2">
            {clientStats.map((c, i) => {
              const level = c.avgRisk >= 70 ? "高" : c.avgRisk >= 40 ? "中" : "低";
              const color =
                level === "高"
                  ? "bg-destructive/15 text-destructive border-destructive/40"
                  : level === "中"
                    ? "bg-[#f97316]/15 text-[#f97316] border-[#f97316]/40"
                    : "bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/40";
              const action = level === "高" ? "主動聯繫＋合約審查" : level === "中" ? "本週回訪" : "持續觀察";
              return (
                <div
                  key={c.name}
                  className="flex items-center gap-3 p-3 bg-background rounded border border-border"
                >
                  <div className="w-7 h-7 rounded-md bg-secondary text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground">{c.name}</div>
                    <div className="text-xs text-muted-foreground">
                      設備 {c.deviceCount} 台 · 平均風險 {c.avgRisk.toFixed(1)} 分
                    </div>
                  </div>
                  <span
                    className={cn(
                      "px-2 h-6 rounded text-xs font-semibold inline-flex items-center border",
                      color,
                    )}
                  >
                    {level}
                  </span>
                  <div className="text-xs text-muted-foreground hidden md:block">
                    建議：{action}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      </div>

      <Section
        title="擴張承載能力分析"
        actions={
          <div className="text-xs text-muted-foreground">
            目前利用率 <span className="text-primary font-semibold">{currentUtil.toFixed(1)}%</span>
            　可安全新增 <span className="text-primary font-semibold">{maxSafeAdd}</span> 台（≤85% 目標）
          </div>
        }
      >
        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={curve.data} margin={{ top: 8, right: 16, left: 4, bottom: 4 }}>
              <CartesianGrid stroke="#ffffff10" />
              <XAxis
                dataKey="added"
                stroke="#9ca3af"
                fontSize={11}
                label={{ value: "新增設備數", position: "insideBottom", offset: -2, fill: "#9ca3af", fontSize: 11 }}
              />
              <YAxis
                stroke="#9ca3af"
                fontSize={11}
                unit="%"
                domain={[0, 130]}
                label={{ value: "預估利用率", angle: -90, position: "insideLeft", fill: "#9ca3af", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{ background: "#0a1814", border: "1px solid #ffffff20", borderRadius: 6, fontSize: 12 }}
                formatter={(v: number) => [`${v}%`, "預估利用率"]}
                labelFormatter={(l) => `新增 ${l} 台`}
              />
              <ReferenceLine y={85} stroke="#f97316" strokeDasharray="4 4" label={{ value: "85% 安全線", fill: "#f97316", fontSize: 11, position: "insideTopRight" }} />
              <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "100% 滿載", fill: "#ef4444", fontSize: 11, position: "insideTopRight" }} />
              <Line type="monotone" dataKey="util" stroke="#a3e635" strokeWidth={2} dot={false} />
              <ReferenceDot x={0} y={currentUtil} r={6} fill="#a3e635" stroke="#fff" strokeWidth={2} label={{ value: "目前", fill: "#a3e635", position: "top", fontSize: 11 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Section>
    </div>
  );
}
