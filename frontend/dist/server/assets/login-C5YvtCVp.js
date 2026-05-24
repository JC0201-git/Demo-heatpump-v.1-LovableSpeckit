import { T as reactExports, K as jsxRuntimeExports } from "./server-CzeLhqbS.js";
import { u as useNavigate } from "./router-sZOWJ7Yg.js";
import { c as createLucideIcon, A as Activity } from "./activity-F8GmJbQr.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const EyeOff = createLucideIcon("eye-off", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode);
function LoginPage() {
  const nav = useNavigate();
  const [user, setUser] = reactExports.useState("demo");
  const [pwd, setPwd] = reactExports.useState("demo1234");
  const [showPwd, setShowPwd] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState("");
  function submit(e) {
    e.preventDefault();
    if (!user || !pwd) {
      setErr("請輸入帳號與密碼");
      return;
    }
    nav({
      to: "/overview"
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background flex items-start justify-center px-4 pt-[18vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-[360px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-10 justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-md bg-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-6 h-6 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-bold text-foreground", children: "熱泵維運監控平台" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: "HeatPump Monitor v0.1" })
      ] })
    ] }),
    err && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center gap-2 text-xs text-[#ef4444]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚠" }),
      " ",
      err
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "使用者名稱" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: user, onChange: (e) => setUser(e.target.value), className: "w-full h-10 bg-transparent border-b border-border focus:border-primary outline-none text-sm text-foreground", placeholder: "請輸入帳號" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground mb-1", children: "密碼" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: showPwd ? "text" : "password", value: pwd, onChange: (e) => setPwd(e.target.value), className: "w-full h-10 bg-transparent border-b border-border focus:border-primary outline-none text-sm text-foreground pr-8", placeholder: "請輸入密碼" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPwd((v) => !v), className: "absolute right-1 top-2 text-muted-foreground hover:text-foreground", children: showPwd ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "w-full h-10 bg-primary text-primary-foreground font-semibold rounded-md text-sm hover:bg-primary/90 transition-colors focus-ring", children: "登入" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground text-center", children: "Demo 模式：任意帳密皆可登入" })
    ] })
  ] }) });
}
export {
  LoginPage as component
};
