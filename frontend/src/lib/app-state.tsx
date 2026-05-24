import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { devices as seedDevices, alertsSeed } from "./mocks/data";
import type { AlertItem, AlertStatus, Device } from "./mocks/types";

interface AppState {
  devices: Device[];
  alerts: AlertItem[];
  apiDown: boolean;
  setApiDown: (v: boolean) => void;
  lastUpdate: Date;
  assignAlert: (id: string, assignee: string) => void;
  resolveAlert: (id: string, note: string) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(seedDevices);
  const [alerts, setAlerts] = useState<AlertItem[]>(alertsSeed);
  const [apiDown, setApiDown] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate live data: jitter metrics + heartbeat every 5s
  useEffect(() => {
    const t = setInterval(() => {
      setDevices((prev) =>
        prev.map((d) => {
          if (d.status === "offline") return d;
          const jitter = (n: number, amp: number) =>
            +(n + (Math.random() - 0.5) * amp).toFixed(2);
          return {
            ...d,
            outletTemp: jitter(d.outletTemp, 0.6),
            inletTemp: jitter(d.inletTemp, 0.6),
            ambientTemp: jitter(d.ambientTemp, 0.3),
            powerKW: Math.max(0, jitter(d.powerKW, 0.8)),
            cop: Math.max(0, jitter(d.cop, 0.05)),
            lastHeartbeatAt: new Date().toISOString(),
          };
        }),
      );
      setLastUpdate(new Date());
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const assignAlert = (id: string, assignee: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              assignee,
              assignedAt: new Date().toISOString(),
              status: "in_progress" as AlertStatus,
            }
          : a,
      ),
    );
  };

  const resolveAlert = (id: string, note: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "resolved" as AlertStatus,
              resolvedAt: new Date().toISOString(),
              resolutionNote: note || "已現場處理完畢",
            }
          : a,
      ),
    );
  };

  const value = useMemo<AppState>(
    () => ({
      devices,
      alerts,
      apiDown,
      setApiDown,
      lastUpdate,
      assignAlert,
      resolveAlert,
    }),
    [devices, alerts, apiDown, lastUpdate],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAppState outside provider");
  return v;
}
