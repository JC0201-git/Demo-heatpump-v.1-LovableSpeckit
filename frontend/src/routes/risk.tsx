import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader, Section } from "@/components/ui-bits";
import { useAppState } from "@/lib/app-state";
import { recommendedAction } from "@/lib/format";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/risk")({
  component: () => (
    <AppShell>
      <Risk />
    </AppShell>
  ),
});

function Risk() {
  const { devices } = useAppState();

  const top10 = useMemo(
    () => [...devices].sort((a, b) => b.riskScore - a.riskScore).slice(0, 10),
    [devices],
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader
        title="風險排序 Top 10"
        description="依據健康分數、近期告警與保養紀錄綜合計算，協助主管優先派工。"
      />

      <Section>
        <div className="space-y-2">
          {top10.map((d, idx) => {
            const action = recommendedAction(d.riskScore);
            const rank = idx + 1;
            const change = d.rankChange;
            return (
              <Link
                key={d.id}
                to="/device/$id"
                params={{ id: d.id }}
                className="flex items-center gap-3 sm:gap-4 p-3 rounded-md bg-background hover:bg-accent/50 transition-colors focus-ring border border-border"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-md flex items-center justify-center font-bold text-base flex-shrink-0",
                    rank <= 3
                      ? "bg-destructive text-white"
                      : "bg-secondary text-primary",
                  )}
                >
                  {rank}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{d.code}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-sm text-foreground">{d.clientName}</span>
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      · {d.location}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 truncate">
                    主因：{d.riskReason}
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-6">
                  <div className="text-right">
                    <div className="text-[10px] text-muted-foreground">風險分數</div>
                    <div className="text-xl font-bold tabular-nums text-destructive">
                      {d.riskScore}
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col items-center w-12">
                    <div className="text-[10px] text-muted-foreground">排名變動</div>
                    {change === "up" ? (
                      <ArrowUp className="w-5 h-5 text-destructive" />
                    ) : change === "down" ? (
                      <ArrowDown className="w-5 h-5 text-[#22c55e]" />
                    ) : (
                      <Minus className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  <div
                    className={cn(
                      "hidden md:inline-flex items-center px-2 h-7 rounded text-xs font-semibold",
                      action.level === "緊急"
                        ? "bg-destructive/15 text-destructive border border-destructive/40"
                        : action.level === "本週"
                          ? "bg-[#f97316]/15 text-[#f97316] border border-[#f97316]/40"
                          : "bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/40",
                    )}
                  >
                    {action.label}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
