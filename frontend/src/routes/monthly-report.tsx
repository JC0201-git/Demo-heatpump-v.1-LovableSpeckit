import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { PageHeader, MetricCard, Section } from "@/components/ui-bits";
import { useAppState } from "@/lib/app-state";
import { systemSettings } from "@/lib/mocks/data";
import { Download, Loader2 } from "lucide-react";

export const Route = createFileRoute("/monthly-report")({
  component: () => (
    <AppShell>
      <MonthlyReport />
    </AppShell>
  ),
});

function MonthlyReport() {
  const { devices, alerts } = useAppState();
  const now = new Date();
  const [month, setMonth] = useState(
    `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`,
  );
  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const [year, monthN] = month.split("-").map(Number);
  const daysInMonth = new Date(year, monthN, 0).getDate();

  // Health score buckets (FR-022)
  const healthBuckets = useMemo(() => {
    const buckets = [
      { range: "0-20", count: 0 },
      { range: "21-40", count: 0 },
      { range: "41-60", count: 0 },
      { range: "61-80", count: 0 },
      { range: "81-100", count: 0 },
    ];
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

  const avgHealth = useMemo(
    () =>
      devices.reduce((s, d) => s + (100 - d.riskScore), 0) / devices.length,
    [devices],
  );

  const monthAlerts = useMemo(
    () =>
      alerts.filter((a) => a.occurredAt.startsWith(month)),
    [alerts, month],
  );

  const alertTypeStats = useMemo(() => {
    const map = new Map<string, number>();
    monthAlerts.forEach((a) => map.set(a.type, (map.get(a.type) || 0) + 1));
    return [...map.entries()]
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }, [monthAlerts]);

  const top5Devices = useMemo(() => {
    const map = new Map<string, { code: string; count: number }>();
    monthAlerts.forEach((a) => {
      const cur = map.get(a.deviceId) || { code: a.deviceCode, count: 0 };
      cur.count++;
      map.set(a.deviceId, cur);
    });
    return [...map.values()]
      .sort((a, b) => b.count - a.count || a.code.localeCompare(b.code))
      .slice(0, 5);
  }, [monthAlerts]);

  const resolvedCount = monthAlerts.filter((a) => a.status === "resolved").length;
  const resolveRate =
    monthAlerts.length === 0 ? 0 : (resolvedCount / monthAlerts.length) * 100;
  const overdueCount = monthAlerts.filter(
    (a) =>
      a.status !== "resolved" &&
      (Date.now() - new Date(a.occurredAt).getTime()) / 3600_000 >
        systemSettings.ALERT_OVERDUE_HOURS,
  ).length;

  const avgResolveHr = useMemo(() => {
    const resolved = monthAlerts.filter((a) => a.resolvedAt);
    if (resolved.length === 0) return 0;
    const total = resolved.reduce(
      (s, a) =>
        s +
        (new Date(a.resolvedAt!).getTime() - new Date(a.occurredAt).getTime()) /
          3600_000,
      0,
    );
    return total / resolved.length;
  }, [monthAlerts]);

  async function exportPdf() {
    if (!reportRef.current) return;
    setExporting(true);
    setProgress(10);
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);
    setProgress(40);
    const canvas = await html2canvas(reportRef.current, {
      backgroundColor: "#0d1f1a",
      scale: 2,
      useCORS: true,
    });
    setProgress(75);
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
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
      // multi-page slice
      let position = 0;
      const pageCanvas = document.createElement("canvas");
      const ctx = pageCanvas.getContext("2d")!;
      const sliceHeightPx = (usableH / imgW) * canvas.width;
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

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader
        title="月度設備健康報告"
        description="提供主管彙整每月設備健康概況、異常統計與告警處理狀態。"
        actions={
          <div className="flex items-center gap-2">
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="h-9 px-3 text-sm rounded-md bg-background border border-border text-foreground focus-ring"
            />
            <button
              onClick={exportPdf}
              disabled={exporting}
              className="h-9 px-3 text-sm rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 focus-ring inline-flex items-center gap-1.5 disabled:opacity-60"
            >
              <Download className="w-4 h-4" /> 匯出 PDF
            </button>
          </div>
        }
      />

      <div ref={reportRef} className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            label="平均健康分數"
            value={avgHealth.toFixed(1)}
            unit="分"
            accent={avgHealth >= 70 ? "ok" : avgHealth >= 40 ? "warn" : "error"}
            hint={`管理設備 ${devices.length} 台`}
          />
          <MetricCard
            label="本月告警總數"
            value={monthAlerts.length}
            unit="筆"
            hint={`每日均 ${(monthAlerts.length / daysInMonth).toFixed(1)} 筆`}
          />
          <MetricCard
            label="已解除率"
            value={resolveRate.toFixed(1)}
            unit="%"
            accent={resolveRate >= 80 ? "ok" : "warn"}
            hint={`已解除 ${resolvedCount} / ${monthAlerts.length}`}
          />
          <MetricCard
            label="平均解除時間"
            value={avgResolveHr.toFixed(1)}
            unit="小時"
            hint={`逾時 ${overdueCount} 筆`}
            accent={overdueCount > 0 ? "error" : "ok"}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <Section title="設備健康分數分布（直方圖）">
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={healthBuckets}>
                  <CartesianGrid stroke="#ffffff10" />
                  <XAxis dataKey="range" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#0a1814",
                      border: "1px solid #ffffff20",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {healthBuckets.map((b, i) => (
                      <Cell
                        key={i}
                        fill={
                          i <= 1
                            ? "#ef4444"
                            : i === 2
                              ? "#f97316"
                              : i === 3
                                ? "#38bdf8"
                                : "#a3e635"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="異常類型分布">
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={alertTypeStats} layout="vertical">
                  <CartesianGrid stroke="#ffffff10" />
                  <XAxis type="number" stroke="#9ca3af" fontSize={11} allowDecimals={false} />
                  <YAxis type="category" dataKey="type" stroke="#9ca3af" fontSize={11} width={88} />
                  <Tooltip
                    contentStyle={{ background: "#0a1814", border: "1px solid #ffffff20", borderRadius: 6, fontSize: 12 }}
                  />
                  <Bar dataKey="count" fill="#a3e635" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>

        <Section title="本月異常 Top 5 設備">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[420px]">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border text-left">
                  <th className="py-2 px-3 font-medium">排名</th>
                  <th className="py-2 px-3 font-medium">設備編號</th>
                  <th className="py-2 px-3 font-medium text-right">異常次數</th>
                  <th className="py-2 px-3 font-medium text-right">每日平均</th>
                </tr>
              </thead>
              <tbody>
                {top5Devices.map((d, i) => (
                  <tr key={d.code} className="border-b border-border/50">
                    <td className="py-2 px-3 font-bold text-primary">{i + 1}</td>
                    <td className="py-2 px-3 text-foreground">{d.code}</td>
                    <td className="py-2 px-3 text-right tabular-nums">{d.count}</td>
                    <td className="py-2 px-3 text-right tabular-nums text-muted-foreground">
                      {(d.count / daysInMonth).toFixed(2)}
                    </td>
                  </tr>
                ))}
                {top5Devices.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-muted-foreground">
                      本月無告警紀錄
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Section>
      </div>

      {exporting && (
        <div className="fixed bottom-4 right-4 bg-card border border-border rounded-md shadow-lg px-4 py-3 flex items-center gap-3 z-50">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <div className="text-xs">
            <div className="text-foreground font-semibold">匯出中 {progress}%</div>
            <div className="w-40 h-1 bg-secondary rounded overflow-hidden mt-1">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
