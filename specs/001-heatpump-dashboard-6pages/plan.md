# 實作計畫：熱泵儀表板前後端整合

**分支**：`integrate-lovable-frontend` | **日期**：2026-05-24 | **規格**：[spec.md](./spec.md)

**輸入**：`specs/001-heatpump-dashboard-6pages/spec.md`

---

## 摘要

本計畫描述如何將 Lovable 產出的前端（`frontend/`）與 Node.js Express 後端（`backend/`）透過 REST API 整合，使儀表板所有 6 個頁面從現有的 Mock 靜態資料切換至真實後端資料源。前端透過 TanStack Query 呼叫後端 `/api/v1` 端點；後端負責存取 MySQL（業務資料）與 InfluxDB 1.8（時序感測器資料），並統一輸出符合 `contracts/openapi.yaml` 規範的 JSON 回應。

關鍵整合工作：
1. **型別對齊**：前端 Mock 型別（`DeviceStatus`、`riskScore` 等）與後端 API 型別對齊
2. **API 客戶端層**：建立 TanStack Query hooks，替換所有 Mock 資料呼叫
3. **後端鷹架**：建立 Express.js 後端，實作全部 `/api/v1` 端點
4. **角色控制**：前端每個請求攜帶 `X-Role` header；後端 middleware 驗證權限
5. **降級顯示**：前端偵測 `degraded: true` 回應，顯示最後已知狀態與資料時戳警示

---

## 技術背景

**語言/版本（前端）**：TypeScript 5.x + React 19

**語言/版本（後端）**：Node.js 20 LTS + TypeScript 5.x

**主要依賴（前端）**：
- TanStack Router（File-based 路由）
- TanStack Query v5（資料請求與快取）
- Radix UI + Tailwind CSS v4（UI 元件與樣式）
- Recharts（圖表）
- Vite + TanStack Start（建置工具）

**主要依賴（後端）**：
- Express.js 4.x（REST API 框架）
- Sequelize v6 + `mysql2`（MySQL ORM）
- `node-influx` 或 InfluxDB 1.8 HTTP API（時序資料）
- `node-cron`（5 分鐘狀態更新排程）
- `ejs`（月報 HTML 模板）
- `@faker-js/faker`（Mock 設備 Seed 資料）

**儲存**：
- MySQL 8.0（業務資料：設備、告警、風險指派、保養紀錄、月報）
- InfluxDB 1.8（時序感測器讀值，透過 Node-RED HTTP endpoint）

**測試**：
- 前端：Vitest + React Testing Library
- 後端：Jest + Supertest（API 整合測試）

**目標平台**：桌面瀏覽器（螢幕寬度 ≥ 1280px）；部署至 Cloudflare Workers（前端）

**專案類型**：全端 Web 應用程式（前後端分離，REST API 整合）

**效能目標**：
- 初始頁面載入 LCP ≤ 2.5 秒（Lighthouse CI 強制執行）
- TTI ≤ 3.5 秒
- API 呼叫 p95 ≤ 500 ms
- 月報產生 ≤ 30 秒

**限制**：
- v1 不實作手機/平板版面
- v1 角色驗證使用 `X-Role` header（不是 JWT）；後端不強制認證，視為 Demo 機制
- 前端不直接連接 MySQL、InfluxDB 或 MQTT Broker
- 所有 API 契約以 `contracts/openapi.yaml` 為唯一真理來源

**規模**：80 台設備（3 台真實 + 77 台模擬）、3 個客戶場域、6 個頁面、2 種使用者角色

---

## 憲法審查

*閘門：Phase 0 研究前必須通過。Phase 1 設計後重新確認。*

### Phase 0 前審查

| 原則 | 狀態 | 說明 |
|------|------|------|
| I. 程式碼品質 | ✅ 通過 | 前後端均設定 ESLint + Prettier；所有命名常數化（API 路徑、狀態值） |
| II. 測試優先 | ✅ 通過 | API 契約測試（Supertest）與前端 hook 測試（Vitest）先於實作撰寫 |
| III. UX 一致性 | ✅ 通過 | 沿用現有 Radix UI + Tailwind 共用元件庫；降級狀態以統一 Banner 元件顯示 |
| IV. 效能要求 | ✅ 通過 | TanStack Query 快取（stale-while-revalidate）；輪詢間隔 60 秒 |
| V. 文件語言 | ✅ 通過 | plan.md、research.md、data-model.md、quickstart.md 均以繁體中文撰寫 |

**複雜度違例**：無（前後端分離為規格明確要求，非過度設計）

### Phase 1 後重新確認

| 原則 | 狀態 | 補充 |
|------|------|------|
| I. 程式碼品質 | ✅ 通過 | openapi.yaml 作為契約唯一來源，後端路由直接對應 |
| II. 測試優先 | ✅ 通過 | 每個 API 端點均有對應的 Supertest 契約測試 |
| III. UX 一致性 | ✅ 通過 | 降級 Banner、Loading skeleton、Error state 均使用共用元件 |
| IV. 效能要求 | ✅ 通過 | InfluxDB 透過 Node-RED → 後端，非前端直連；後端快取熱資料 |
| V. 文件語言 | ✅ 通過 | openapi.yaml 的 description 欄位以繁體中文撰寫 |

---

## 專案結構

### 規格文件（本功能）

```text
specs/001-heatpump-dashboard-6pages/
├── plan.md                        # 本檔案
├── research.md                    # Phase 0 技術研究（已完成）
├── data-model.md                  # Phase 1 資料模型設計（已完成）
├── quickstart.md                  # Phase 1 快速起步指南（已更新）
├── frontend-integration-notes.md  # 前端整合說明（已完成）
├── contracts/
│   ├── rest-api.md                # REST API 說明文件（人類可讀）
│   └── openapi.yaml               # Phase 1 新增：OpenAPI 3.0 規範（機器可讀，唯一真理來源）
└── tasks.md                       # Phase 2 產出（由 /speckit.tasks 指令產生）
```

### 原始碼（儲存庫根目錄）

```text
frontend/                          # Lovable 產出的 React 前端（現有）
├── src/
│   ├── routes/                    # 6 個頁面（已建立，需接線至 API）
│   │   ├── __root.tsx
│   │   ├── index.tsx              → 跳轉 /overview
│   │   ├── overview.tsx           # 設備總覽（P1）
│   │   ├── risk.tsx               # 風險排序（P2）
│   │   ├── device.$id.tsx         # 單機履歷（P3）
│   │   ├── alerts.tsx             # 告警中心（P4）
│   │   ├── monthly-report.tsx     # 月報雛形（P5）
│   │   └── executive.tsx          # 老闆決策頁（P6）
│   ├── components/
│   │   ├── app-shell.tsx          # 共用頁框（側邊導覽）
│   │   ├── badges.tsx
│   │   ├── ui-bits.tsx
│   │   └── ui/                    # Radix UI 元件
│   ├── lib/
│   │   ├── api/                   # 【新增】API 客戶端層
│   │   │   ├── client.ts          # axios/fetch 實例（含 X-Role header 注入）
│   │   │   ├── queries/           # TanStack Query hooks（每個端點一個 hook）
│   │   │   │   ├── useSites.ts
│   │   │   │   ├── useDevices.ts
│   │   │   │   ├── useDevice.ts
│   │   │   │   ├── useDeviceHistory.ts
│   │   │   │   ├── useRisks.ts
│   │   │   │   ├── useAlerts.ts
│   │   │   │   ├── useMonthlyReport.ts
│   │   │   │   └── useDashboardSummary.ts
│   │   │   └── types.ts           # 與後端 API 對齊的型別定義（替換 mocks/types.ts）
│   │   ├── app-state.tsx          # 全域狀態（RoleContext，保留角色切換邏輯）
│   │   ├── format.ts              # 狀態標籤/顏色/時間格式工具
│   │   └── mocks/                 # 保留供離線/開發 Fallback 使用
│   └── hooks/
│       └── use-mobile.tsx

backend/                           # 【新建】Node.js Express 後端
├── src/
│   ├── app.ts                     # Express 應用程式主入口
│   ├── server.ts                  # HTTP Server 啟動
│   ├── middleware/
│   │   ├── roleGuard.ts           # 讀取 X-Role header，設定 req.role
│   │   ├── errorHandler.ts        # 統一錯誤格式（符合 openapi.yaml error schema）
│   │   └── degradedWrapper.ts     # InfluxDB/Node-RED 失敗時包裝降級回應
│   ├── routes/
│   │   ├── sites.ts
│   │   ├── devices.ts
│   │   ├── risks.ts
│   │   ├── alerts.ts
│   │   ├── reports.ts
│   │   ├── dashboard.ts
│   │   └── health.ts
│   ├── services/
│   │   ├── siteService.ts
│   │   ├── deviceService.ts       # 整合 MySQL + InfluxDB 最新讀值
│   │   ├── influxService.ts       # InfluxDB 1.8 HTTP API 存取（透過 Node-RED）
│   │   ├── riskService.ts
│   │   ├── alertService.ts
│   │   ├── reportService.ts       # 月報產生（計算可用率）
│   │   ├── dashboardService.ts
│   │   ├── statusUpdater.ts       # node-cron：每 5 分鐘更新 current_status
│   │   └── mockDataService.ts     # 77 台模擬設備的即時資料動態產生
│   ├── models/                    # Sequelize v6 模型（對應 data-model.md 資料表）
│   │   ├── index.ts
│   │   ├── Site.ts
│   │   ├── HeatPump.ts
│   │   ├── RiskAssignment.ts
│   │   ├── Alert.ts
│   │   ├── MaintenanceRecord.ts
│   │   ├── StatusSnapshot.ts
│   │   └── MonthlyReport.ts
│   └── templates/
│       └── monthly-report.ejs
├── db/
│   ├── migrations/                # Sequelize CLI migration 檔案
│   └── seeders/                   # Seed：3 個場域、80 台設備（含 77 台模擬）
├── tests/
│   ├── contract/                  # Supertest 契約測試（對照 openapi.yaml）
│   └── unit/                      # 業務邏輯單元測試
└── package.json
```

---

## 複雜度追蹤

> *憲法審查無違例，本欄位不填寫*
