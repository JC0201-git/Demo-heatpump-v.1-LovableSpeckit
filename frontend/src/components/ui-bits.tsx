import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:justify-between mb-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  unit,
  trend,
  hint,
  accent,
  icon,
}: {
  label: string;
  value: string | number;
  unit?: string;
  trend?: { dir: "up" | "down" | "flat"; text: string };
  hint?: string;
  accent?: "ok" | "error" | "warn" | "primary";
  icon?: ReactNode;
}) {
  const accentBar: Record<string, string> = {
    ok: "bg-[#22c55e]",
    error: "bg-[#ef4444]",
    warn: "bg-[#f97316]",
    primary: "bg-primary",
  };
  return (
    <div className="relative bg-card border border-border rounded-lg p-4 overflow-hidden">
      {accent && (
        <div className={cn("absolute left-0 top-0 bottom-0 w-1", accentBar[accent])} />
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="text-xs text-muted-foreground font-medium">{label}</div>
        {icon}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <div className="text-2xl font-bold text-foreground tabular-nums">{value}</div>
        {unit && <div className="text-xs text-muted-foreground">{unit}</div>}
      </div>
      {(trend || hint) && (
        <div className="mt-1.5 flex items-center gap-2">
          {trend && (
            <span
              className={cn(
                "text-[11px] font-semibold",
                trend.dir === "up"
                  ? "text-[#ef4444]"
                  : trend.dir === "down"
                    ? "text-[#22c55e]"
                    : "text-muted-foreground",
              )}
            >
              {trend.dir === "up" ? "↑" : trend.dir === "down" ? "↓" : "→"} {trend.text}
            </span>
          )}
          {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
        </div>
      )}
    </div>
  );
}

export function Section({
  title,
  children,
  actions,
  className,
}: {
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg p-4 sm:p-5",
        className,
      )}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4 gap-2">
          {title && (
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          )}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}

export function EmptyState({ text = "暫無資料" }: { text?: string }) {
  return (
    <div className="text-center py-10 text-sm text-muted-foreground">{text}</div>
  );
}
