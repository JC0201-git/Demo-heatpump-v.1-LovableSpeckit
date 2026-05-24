import { cn } from "@/lib/utils";
import { STATUS_COLOR, STATUS_LABEL, SEVERITY_COLOR, SEVERITY_LABEL, ALERT_STATUS_LABEL } from "@/lib/format";
import type { DeviceStatus, AlertSeverity, AlertStatus } from "@/lib/mocks/types";

export function StatusDot({ color, pulse }: { color: string; pulse?: boolean }) {
  return (
    <span className="relative inline-flex w-2 h-2">
      {pulse && (
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-60"
          style={{ backgroundColor: color }}
        />
      )}
      <span
        className="relative rounded-full w-2 h-2"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

export function StatusBadge({
  status,
  className,
}: {
  status: DeviceStatus;
  className?: string;
}) {
  const color = STATUS_COLOR[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 h-6 px-2 rounded text-[12px] font-semibold text-white",
        className,
      )}
      style={{ backgroundColor: color }}
    >
      <StatusDot color="#fff" pulse={status === "abnormal"} />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  const color = SEVERITY_COLOR[severity];
  return (
    <span
      className="inline-flex items-center h-6 px-2 rounded text-[12px] font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {SEVERITY_LABEL[severity]}
    </span>
  );
}

export function AlertStatusBadge({ status }: { status: AlertStatus }) {
  const colors: Record<AlertStatus, string> = {
    open: "bg-[#6b7280]",
    in_progress: "bg-[#38bdf8]",
    resolved: "bg-[#22c55e]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center h-6 px-2 rounded text-[12px] font-semibold text-white",
        colors[status],
      )}
    >
      {ALERT_STATUS_LABEL[status]}
    </span>
  );
}
