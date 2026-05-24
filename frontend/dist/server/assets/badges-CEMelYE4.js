import { K as jsxRuntimeExports } from "./server-CzeLhqbS.js";
import { c as SEVERITY_LABEL, S as SEVERITY_COLOR, A as ALERT_STATUS_LABEL, g as cn, e as STATUS_LABEL, d as STATUS_COLOR } from "./app-shell-BIbYDl8S.js";
function StatusDot({ color, pulse }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative inline-flex w-2 h-2", children: [
    pulse && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "absolute inset-0 rounded-full animate-ping opacity-60",
        style: { backgroundColor: color }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "relative rounded-full w-2 h-2",
        style: { backgroundColor: color }
      }
    )
  ] });
}
function StatusBadge({
  status,
  className
}) {
  const color = STATUS_COLOR[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1.5 h-6 px-2 rounded text-[12px] font-semibold text-white",
        className
      ),
      style: { backgroundColor: color },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusDot, { color: "#fff", pulse: status === "abnormal" }),
        STATUS_LABEL[status]
      ]
    }
  );
}
function SeverityBadge({ severity }) {
  const color = SEVERITY_COLOR[severity];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "inline-flex items-center h-6 px-2 rounded text-[12px] font-semibold text-white",
      style: { backgroundColor: color },
      children: SEVERITY_LABEL[severity]
    }
  );
}
function AlertStatusBadge({ status }) {
  const colors = {
    open: "bg-[#6b7280]",
    in_progress: "bg-[#38bdf8]",
    resolved: "bg-[#22c55e]"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: cn(
        "inline-flex items-center h-6 px-2 rounded text-[12px] font-semibold text-white",
        colors[status]
      ),
      children: ALERT_STATUS_LABEL[status]
    }
  );
}
export {
  AlertStatusBadge as A,
  SeverityBadge as S,
  StatusBadge as a
};
