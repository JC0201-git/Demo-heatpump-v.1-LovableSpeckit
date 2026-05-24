import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import {
  LayoutGrid,
  AlertTriangle,
  Activity,
  FileBarChart2,
  Briefcase,
  Bell,
  Menu,
  WifiOff,
  RefreshCw,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppStateProvider, useAppState } from "@/lib/app-state";
import { fmtDateTime } from "@/lib/format";

const NAV = [
  { to: "/overview", label: "設備總覽", icon: LayoutGrid },
  { to: "/risk", label: "風險排序", icon: Activity },
  { to: "/alerts", label: "告警中心", icon: Bell },
  { to: "/monthly-report", label: "月報雛形", icon: FileBarChart2 },
  { to: "/executive", label: "老闆決策頁", icon: Briefcase },
];

function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const { location } = useRouterState();
  const path = location.pathname;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={cn(
          "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200 z-50",
          "fixed lg:static inset-y-0 left-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "w-[60px]" : "w-[240px]",
        )}
      >
        <div className="h-14 flex items-center gap-2 px-4 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="text-sm">
              <div className="font-semibold text-foreground leading-tight">熱泵維運</div>
              <div className="text-[11px] text-muted-foreground leading-tight">
                HeatPump Monitor
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 py-3 space-y-1 px-2">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = path === n.to || (n.to !== "/" && path.startsWith(n.to));
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={onMobileClose}
                className={cn(
                  "flex items-center gap-3 px-3 h-10 rounded-md text-sm transition-colors focus-ring",
                  active
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
                title={collapsed ? n.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{n.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-2 space-y-1">
          <button
            onClick={onToggle}
            className="hidden lg:flex w-full items-center gap-3 px-3 h-9 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent focus-ring"
          >
            <Menu className="w-4 h-4" />
            {!collapsed && <span>收合側欄</span>}
          </button>
          <Link
            to="/login"
            className="flex items-center gap-3 px-3 h-9 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent focus-ring"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>登出</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}

function ApiBanner() {
  const { apiDown, setApiDown } = useAppState();
  if (!apiDown) return null;
  return (
    <div className="sticky top-0 z-30 bg-[#3b1414] border-l-4 border-destructive px-4 py-2 flex items-center gap-3 text-sm">
      <WifiOff className="w-4 h-4 text-destructive flex-shrink-0" />
      <span className="text-destructive-foreground flex-1">
        API 連線異常：部分設備即時資料可能過期，請稍候自動重試或手動重新整理。
      </span>
      <button
        onClick={() => setApiDown(false)}
        className="px-2 py-1 rounded bg-destructive text-destructive-foreground text-xs hover:bg-destructive/90 flex items-center gap-1 focus-ring"
      >
        <RefreshCw className="w-3 h-3" /> 重試
      </button>
      <button
        onClick={() => setApiDown(false)}
        className="text-muted-foreground hover:text-foreground focus-ring rounded"
        aria-label="關閉"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function TopBar({ onMobileMenu }: { onMobileMenu: () => void }) {
  const { lastUpdate, apiDown, setApiDown } = useAppState();
  return (
    <header className="h-14 bg-card border-b border-border flex items-center px-4 gap-4 flex-shrink-0">
      <button
        onClick={onMobileMenu}
        className="lg:hidden text-foreground focus-ring rounded p-1"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-medium text-foreground truncate">
          熱泵設備運維監控平台
        </h1>
        <p className="text-[11px] text-muted-foreground truncate" suppressHydrationWarning>
          最後資料更新 · {fmtDateTime(lastUpdate.toISOString())}
        </p>
      </div>
      <button
        onClick={() => setApiDown(!apiDown)}
        className="hidden sm:inline-flex items-center gap-1.5 text-xs px-2.5 h-8 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent focus-ring"
      >
        <WifiOff className="w-3.5 h-3.5" />
        {apiDown ? "恢復 API" : "模擬 API 異常"}
      </button>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
          維
        </div>
        <div className="hidden md:block text-xs">
          <div className="text-foreground font-medium leading-tight">維運工程師</div>
          <div className="text-muted-foreground leading-tight">demo@heatpump.tw</div>
        </div>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AppStateProvider>
      <Shell>{children}</Shell>
    </AppStateProvider>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { location } = useRouterState();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMobileMenu={() => setMobileOpen(true)} />
        <ApiBanner />
        <main className="flex-1 overflow-auto page-fade" key={location.pathname}>
          {children}
        </main>
      </div>
    </div>
  );
}
