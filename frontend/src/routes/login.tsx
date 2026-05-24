import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [user, setUser] = useState("demo");
  const [pwd, setPwd] = useState("demo1234");
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !pwd) {
      setErr("請輸入帳號與密碼");
      return;
    }
    nav({ to: "/overview" });
  }

  return (
    <div className="min-h-screen bg-background flex items-start justify-center px-4 pt-[18vh]">
      <div className="w-full max-w-[360px]">
        <div className="flex items-center gap-2 mb-10 justify-center">
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <div className="text-base font-bold text-foreground">熱泵維運監控平台</div>
            <div className="text-[11px] text-muted-foreground">HeatPump Monitor v0.1</div>
          </div>
        </div>

        {err && (
          <div className="mb-4 flex items-center gap-2 text-xs text-[#ef4444]">
            <span>⚠</span> {err}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              使用者名稱
            </label>
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full h-10 bg-transparent border-b border-border focus:border-primary outline-none text-sm text-foreground"
              placeholder="請輸入帳號"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">密碼</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                className="w-full h-10 bg-transparent border-b border-border focus:border-primary outline-none text-sm text-foreground pr-8"
                placeholder="請輸入密碼"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-1 top-2 text-muted-foreground hover:text-foreground"
              >
                {showPwd ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-md text-sm hover:bg-primary/90 transition-colors focus-ring"
          >
            登入
          </button>
          <p className="text-[11px] text-muted-foreground text-center">
            Demo 模式：任意帳密皆可登入
          </p>
        </form>
      </div>
    </div>
  );
}
