---
description: "熱泵設備監控儀表板 — 可執行任務清單"
---

# 任務清單：熱泵設備監控儀表板（6 頁面）

**功能分支**：`001-heatpump-dashboard-6pages`
**輸入文件**：`specs/001-heatpump-dashboard-6pages/`（plan.md、spec.md、data-model.md、contracts/rest-api.md、research.md、quickstart.md）
**產生日期**：2026-05-24

---

## 格式說明：`[TaskID] [P?] [Story?] 任務描述，含確切檔案路徑`

- **[P]**：可平行執行（不同檔案、無未完成任務依賴）
- **[Story]**：所屬使用者故事（US1–US6），專案初始化／基礎建設階段不加此標籤

---

## 第一階段：專案初始化

**目的**：建立基本目錄結構與開發工具設定

- [ ] T001 依實作計畫建立後端目錄結構（`backend/src/{api,models,services,middleware,jobs,templates}/`、`backend/db/{migrations,seeders}/`、`backend/tests/`）
- [ ] T002 [P] 依實作計畫建立前端目錄結構（`frontend/src/{components,pages/{DeviceOverview,RiskRanking,DeviceHistory,AlertCenter,MonthlyReport,ExecutiveDashboard},services,contexts,theme,utils}/`、`frontend/tests/`）
- [ ] T003 初始化後端 Node.js 專案，設定 npm `save-exact=true`，以 `--save-exact` 安裝 express、sequelize、mysql2、node-influx、node-cron、ejs、@faker-js/faker、axios、dotenv、cors；以 `--save-exact --save-dev` 安裝 sequelize-cli、jest、nodemon；提交 `backend/package.json` 與 `backend/package-lock.json`，且不得含浮動版本範圍（`backend/package.json`、`backend/package-lock.json`）
- [ ] T004 [P] 初始化前端 React + TypeScript 專案，設定 npm `save-exact=true`，以 `--save-exact` 安裝 @tanstack/react-query、react-router-dom、recharts、dayjs；以 `--save-exact --save-dev` 安裝 vitest、@playwright/test；提交 `frontend/package.json` 與 `frontend/package-lock.json`，且不得含浮動版本範圍（`frontend/package.json`、`frontend/package-lock.json`）
- [ ] T005 [P] 建立後端環境變數範本，涵蓋 PORT、DB_HOST/PORT/NAME/USER/PASS、INFLUXDB_HOST/PORT/DATABASE、NODERED_BASE_URL、ALERT_CHECK_INTERVAL_MINUTES、DEVICE_OFFLINE_THRESHOLD_MINUTES（`backend/.env.example`）
- [ ] T006 [P] 設定後端 ESLint + Prettier（`backend/.eslintrc.json`、`backend/.prettierrc`）；設定前端 ESLint + Prettier（`frontend/.eslintrc.json`、`frontend/.prettierrc`）
- [ ] T006b [P] 建立 GitHub Actions CI 流程（`.github/workflows/ci.yml`、`.lighthouserc.json`、`scripts/check-exact-deps.mjs`、`frontend/scripts/check-bundle-budget.mjs`、`frontend/bundle-budget.json`）：
  - **程式碼檢查工作**：`cd backend && npm run lint`、`cd frontend && npm run lint`，任一失敗即阻塞合併
  - **測試工作**（依賴程式碼檢查工作）：`cd backend && npm ci && jest --coverage`（需 ≥ 80% line coverage）、`cd frontend && npm ci && vitest run --coverage`（需 ≥ 80%）
  - **依賴鎖定檢查工作**：執行 `node scripts/check-exact-deps.mjs backend/package.json frontend/package.json`，禁止正式與開發依賴使用浮動版本範圍；CI 一律使用 `npm ci`
  - **Lighthouse CI 工作**（依賴測試工作，PR 與 main 分支觸發）：使用 `treosh/lighthouse-ci-action`，設定 `lcp ≤ 2500`、`tti ≤ 3500`、`performance ≥ 90`、`accessibility ≥ 85` 為強制閘門
  - **bundle 預算工作**：前端 build 後執行 `node frontend/scripts/check-bundle-budget.mjs`，計算 gzip 後 JS/CSS 資產大小；任一 PR 相較 `frontend/bundle-budget.json` 增量超過 10 kB 時阻塞合併，除非 PR 明確記錄並核准效能預算例外

---

## 第二階段：基礎建設（阻塞所有使用者故事）

**目的**：所有使用者故事共用的核心基礎設施，必須全部完成後使用者故事才能開始實作

**⚠️ 重要**：此階段完成前，第三至八階段不得開始

### 後端 Express 應用程式

- [ ] T007 建立 Express 應用程式進入點，含 CORS、JSON 解析器、路由掛載骨架、PM2 進程啟動（`backend/src/app.js`）
- [ ] T008 [P] 建立角色守衛中間件，讀取 `X-Role` 標頭驗證 `operator`/`manager` 存取權限，非授權角色回傳 HTTP 403（`backend/src/middleware/roleGuard.js`）
- [ ] T009 [P] 建立全域錯誤處理中間件，依 REST API 契約格式輸出 `{ success: false, error: { code, message } }`（`backend/src/middleware/errorHandler.js`）
- [ ] T010 建立 Sequelize 設定檔與 sequelize-cli 初始化設定，含 development/production 環境區分（`backend/src/config/database.js`、`backend/.sequelizerc`）

### MySQL Migration 與 Sequelize Model

- [ ] T011 建立 Migration：`sites` 資料表（id、name、address、contact、phone、is_active、created_at、updated_at）（`backend/db/migrations/001-create-sites.js`）
- [ ] T012 [P] 建立 Migration：`heat_pumps` 資料表，含 `device_id` UNIQUE 鍵、`installed_at`、`monitoring_started_at`、`monitoring_ended_at`、`is_active`、`current_status` ENUM（normal/warning/fault/offline），並建立 `idx_monitoring_window` 供月報依實際納入監控期間計算分母（`backend/db/migrations/002-create-heat-pumps.js`）
- [ ] T013 [P] 建立 Migration：`risk_assignments` 資料表，含 `risk_level` ENUM（high/medium/low）、`is_current` 欄位、FK→heat_pumps（`backend/db/migrations/003-create-risk-assignments.js`）
- [ ] T014 [P] 建立 Migration：`alerts` 資料表，含 `status` ENUM（open/acknowledged/resolved）、`alert_type` ENUM、完整生命週期欄位（`backend/db/migrations/004-create-alerts.js`）
- [ ] T015 [P] 建立 Migration：`maintenance_records` 資料表，含 maintained_at、technician、maintenance_type、summary、parts_replaced、next_scheduled（`backend/db/migrations/005-create-maintenance-records.js`）
- [ ] T016 [P] 建立 Migration：`monthly_reports` 資料表，含 UNIQUE KEY `(site_id, report_year, report_month)`、summary_html MEDIUMTEXT（`backend/db/migrations/006-create-monthly-reports.js`）
- [ ] T016b [P] 建立 Migration：`status_snapshots` 資料表，含 `heat_pump_id`（FK→heat_pumps）、`snapshot_at` DATETIME（對齊 5 分鐘區間）、`status` ENUM（normal/warning/fault/offline）、`source` VARCHAR（InfluxDB/mock/statusUpdater）、`created_at`；建立唯一鍵 `(heat_pump_id, snapshot_at)`、`idx_snapshot_at` 與 `idx_status`，作為 FR-014 月報可用率唯一歷史來源（`backend/db/migrations/007-create-status-snapshots.js`）
- [ ] T017 建立 Sequelize Model：`Site`，定義關聯 `hasMany(HeatPump)`、`hasMany(MonthlyReport)`（`backend/src/models/site.js`）
- [ ] T018 [P] 建立 Sequelize Model：`HeatPump`，定義 `monitoring_started_at`、`monitoring_ended_at` 欄位與關聯 `belongsTo(Site)`、`hasMany(RiskAssignment)`、`hasMany(Alert)`、`hasMany(MaintenanceRecord)`、`hasMany(StatusSnapshot)`（`backend/src/models/heatPump.js`）
- [ ] T019 [P] 建立 Sequelize Model：`RiskAssignment`，含 `is_current` 業務規則說明（`backend/src/models/riskAssignment.js`）
- [ ] T020 [P] 建立 Sequelize Model：`Alert`，定義生命週期 ENUM 與所有時間戳欄位（`backend/src/models/alert.js`）
- [ ] T021 [P] 建立 Sequelize Model：`MaintenanceRecord`，定義 `belongsTo(HeatPump)` 關聯（`backend/src/models/maintenanceRecord.js`）
- [ ] T022 [P] 建立 Sequelize Model：`MonthlyReport`，定義 `belongsTo(Site)` 關聯（`backend/src/models/monthlyReport.js`）
- [ ] T022b [P] 建立 Sequelize Model：`StatusSnapshot`，定義 `belongsTo(HeatPump)` 關聯、`(heat_pump_id, snapshot_at)` 唯一性與狀態 ENUM；用於月報可用率計算（`backend/src/models/statusSnapshot.js`）
- [ ] T023 建立種子資料腳本：3 個場域（拉拉手游泳學院、洗衣廠、罐頭工廠）+ 3 台真實設備（`is_mock=0`）+ 77 台模擬設備（`is_mock=1`）；所有設備 `device_id` 統一使用 `SITExx-xxx` 格式（如 `SITE01-001`），並填入 `installed_at`、`monitoring_started_at`（預設等於裝機日 00:00:00）、`monitoring_ended_at=null`；使用 @faker-js/faker 固定 seed 值確保可重現（`backend/db/seeders/001-sites-and-devices.js`）

### InfluxDB 串接與模擬資料

- [ ] T024 建立 Node-RED InfluxDB 查詢流程，暴露三個 HTTP 端點（查詢即時資料如 `device_id=SITE01-001`、查詢歷史時序、查詢日彙總）供後端 localhost 內部呼叫；所有端點範例 device_id 使用 `SITExx-xxx` 格式（`node-red/flows.json`）
- [ ] T025 建立 InfluxDB 串接服務，透過 Node-RED HTTP 端點查詢 `heatpump_status` 量測表，含連線失敗時回傳 `degraded` 旗標與最後已知資料（`backend/src/services/influxService.js`）
- [ ] T026 [P] 建立模擬資料服務，依 `device_id` 動態生成溫度（temp_inlet/temp_outlet）、壓力、功率、error_code 等運行參數，對 `is_mock=1` 的設備使用此服務（`backend/src/services/mockDataService.js`）

### 告警引擎

#### TDD：告警規則預期失敗測試（先建立，確認失敗後進入 T027/T028 實作）

- [ ] T026a [P] 建立 alertEngine 預期失敗測試：驗證設備超過 5 分鐘無資料時產生離線告警（`backend/tests/unit/alertEngine.test.js`）
- [ ] T026b [P] 建立 alertEngine 預期失敗測試：驗證 `error_code != 0` 時產生錯誤碼告警（`backend/tests/unit/alertEngine.test.js`）
- [ ] T026c [P] 建立 alertEngine 預期失敗測試：驗證 warning/critical 門檻觸發對應設備狀態（`backend/tests/unit/alertEngine.test.js`）
- [ ] T026d [P] 建立 statusUpdater 預期失敗測試：驗證排程重跑不產生重複告警（唯一性保護）（`backend/tests/unit/statusUpdater.test.js`）
- [ ] T026e [P] 建立 statusUpdater 預期失敗測試：驗證排程上次失敗後，下次執行可補偵測遺漏的告警（`backend/tests/unit/statusUpdater.test.js`）

- [ ] T027 建立告警引擎，實作三種規則：離線偵測（`status_updated_at` 超過 5 分鐘）、錯誤碼偵測（`error_code != 0`）、溫度/壓力門檻超限；新告警寫入 `alerts` 表（`backend/src/services/alertEngine.js`）
- [ ] T028 建立 node-cron 排程任務，每 5 分鐘執行：篩選目前仍在 `monitoring_started_at` 與 `monitoring_ended_at` 監控期間內的設備 → 呼叫告警引擎 → 更新 `heat_pumps.current_status` → 同步寫入 `status_snapshots`（含 `heat_pump_id`、`snapshot_at`、`status`、`source='statusUpdater'`，同一設備同一快照時間不得重複）→ 觸發離線告警（`backend/src/jobs/statusUpdater.js`）

### 系統健康度 API

- [ ] T029 建立系統健康度路由 `GET /api/v1/system/health`，測試 MySQL 與 InfluxDB（透過 Node-RED）連線狀態，回傳各服務 `status: "up"|"down"` 與時間戳（`backend/src/api/system.js`）

### 前端基礎框架

- [ ] T030 建立前端應用程式進入點，設定 React Router 六頁面路由骨架，掛載 React Query Provider 與 RoleContext Provider（`frontend/src/main.tsx`、`frontend/src/App.tsx`）
- [ ] T031 [P] 建立 `RoleContext`，含 localStorage 持久化、角色切換下拉選單 UI（operator/manager）、`X-Role` 標頭自動注入邏輯（`frontend/src/contexts/RoleContext.tsx`）
- [ ] T032 [P] 建立設計 Token，定義設備狀態顏色（normal=green、warning=yellow、fault=red、offline=gray）、字型、間距常數（`frontend/src/theme/tokens.ts`）
- [ ] T033 [P] 建立共用 UI 元件：`StatusDot`（圓形設備狀態指示點）、`Badge`（角色/等級標籤）（`frontend/src/components/StatusDot.tsx`、`frontend/src/components/Badge.tsx`）
- [ ] T034 [P] 建立工具函數：缺欄位回退顯示（`value ?? '--'`）、dayjs 日期格式化、ISO 8601 時間解析（`frontend/src/utils/format.ts`）
- [ ] T035 建立 API 請求基礎函數，自動附加 `X-Role` 標頭、解析通用回傳格式（`{ success, data, degraded }`）、統一錯誤拋出（`frontend/src/services/api.ts`）
- [ ] T036 [P] 建立系統健康度 Hook，每 10 秒輪詢 `/api/v1/system/health`；同時監聽任一主要 API 請求回傳 `degraded:true` 或請求失敗時立即更新 `isDegraded` 旗標，供各頁面顯示「資料可能已過時」橫幅（`frontend/src/services/useSystemHealth.ts`）

**檢查點**：基礎建設就緒，所有使用者故事可開始實作

---

## 第三階段：US1 — 設備總覽（P1）🎯 MVP

**目標**：呈現所有場域 80 台設備的即時運行狀態，含資料降級提示

**獨立測試**：操作人員能在頁面上看到「拉拉手游泳學院（3 台）、洗衣廠（2 台）、罐頭工廠（2 台）」7 台設備的即時狀態卡（含異常醒目標示），以及資料源中斷時的降級提示橫幅，即視為完整可交付

### 測試先行（TDD — 先建立預期失敗測試，確認失敗後進入實作）

- [ ] T037a [P] [US1] 建立後端單元預期失敗測試：驗證 `deviceService.js` 在 `degraded=true` 時回傳最後已知資料與正確 `data_quality` 旗標（`backend/tests/unit/deviceService.test.js`）
- [ ] T037b [P] [US1] 建立前端單元預期失敗測試：驗證 `useDevices` hook 在 API 回傳 `degraded:true` 時，`isDegraded` 旗標正確傳遞至 UI 狀態（`frontend/tests/unit/useDevices.test.ts`）
- [ ] T037c [US1] 建立 Playwright E2E 預期失敗測試（US1 主路徑）：登入 → 進入設備總覽 → 驗證顯示 3 個場域、80 台設備狀態卡（並驗證至少 7 台代表設備資料正確）；模擬 health API 回傳 `down` → 驗證降級橫幅顯示（`frontend/tests/e2e/device-overview.spec.ts`）

### 後端實作

- [ ] T037 [US1] 建立場域 API 路由 `GET /api/v1/sites`，回傳所有啟用場域清單與各場域的設備狀態統計（normal/warning/fault/offline 計數）（`backend/src/api/sites.js`）
- [ ] T038 [US1] 建立裝置服務，整合 MySQL 設備主檔、InfluxDB/Mock 即時資料，回傳含 `data_quality` 與 `degraded` 旗標的完整設備物件（`backend/src/services/deviceService.js`）
- [ ] T039 [P] [US1] 建立設備 API 路由：`GET /api/v1/devices`（支援 site_id/status 篩選與分頁）、`GET /api/v1/devices/:device_id`（含 current_risk、latest_data、installed_at、monitoring_started_at、monitoring_ended_at）（`backend/src/api/devices.js`）

### 前端實作

- [ ] T040 [US1] 建立 `useSites` React Query Hook，60 秒自動刷新，整合 `isDegraded` 旗標（`frontend/src/services/useSites.ts`）
- [ ] T041 [P] [US1] 建立 `useDevices` React Query Hook，支援 `siteId`/`status` 篩選參數、60 秒自動刷新（`frontend/src/services/useDevices.ts`）
- [ ] T042 [US1] 建立設備總覽頁面，含場域分組設備狀態卡（異常設備醒目紅框標示、顯示最後更新時間）、降級狀態橫幅（`frontend/src/pages/DeviceOverview/index.tsx`）

**檢查點**：US1 獨立可測試 — 設備狀態卡正確顯示、降級提示橫幅有效觸發、角色切換 UI 可用

---

## 第四階段：US2 — 風險排序（P2）

**目標**：依維運人員手動指派的風險等級對設備進行降序排列，支援指派操作

**獨立測試**：操作人員能看到依風險等級（高/中/低）排序的設備清單，operator 可指派/更新風險等級，manager 僅可唯讀，即視為完整可交付

### 測試先行（TDD — 先建立預期失敗測試，確認失敗後進入實作）

- [ ] T043a [P] [US2] 建立後端單元預期失敗測試：驗證 `POST /api/v1/risks` 在 `operator` 角色時正確建立指派並將舊紀錄 `is_current` 設為 0；`manager` 角色時回傳 HTTP 403（`backend/tests/unit/risks.test.js`）
- [ ] T043b [US2] 建立 Playwright E2E 預期失敗測試（US2 主路徑）：以 operator 角色進入風險排序 → 開啟指派 Modal → 提交高風險指派 → 驗證清單即時更新；切換 manager 角色 → 驗證指派按鈕不可見（`frontend/tests/e2e/risk-ranking.spec.ts`）

### 後端實作

- [ ] T043 [US2] 建立風險排序 API 路由：`GET /api/v1/risks`（依 risk_level 降序排列，同等級依最後告警時間排序，支援 site_id 篩選）、`POST /api/v1/risks`（operator-only，新增指派時自動將同一設備舊紀錄 `is_current` 設為 0）（`backend/src/api/risks.js`）

### 前端實作

- [ ] T044 [US2] 建立 `useRisks` React Query Hook，含風險指派 `useMutation`（POST）與風險清單查詢（`frontend/src/services/useRisks.ts`）
- [ ] T045 [US2] 建立風險排序頁面，含高/中/低分組設備清單（顯示指派人員/時間/備註）、operator 可用的風險指派 Modal 表單（`frontend/src/pages/RiskRanking/index.tsx`）

**檢查點**：US2 獨立可測試 — 風險清單按等級排序，operator 指派後即時反映，manager 無寫入操作

---

## 第五階段：US3 — 單機履歷（P3）

**目標**：提供單台設備的完整歷史紀錄，含運行參數趨勢圖、保養紀錄、告警歷史

**獨立測試**：工程師能選定任一設備並指定時間範圍，看到以圖表呈現的參數趨勢、保養紀錄清單、告警歷史；無資料期間顯示「此期間無告警紀錄」文字，即視為完整可交付

### 測試先行（TDD — 先建立預期失敗測試，確認失敗後進入實作）

- [ ] T046a [P] [US3] 建立後端單元預期失敗測試：驗證 `GET /api/v1/devices/:device_id/history` 依時間範圍正確切換解析度（≤1d → 5m、≤7d → 1h、>7d → 1d）（`backend/tests/unit/deviceHistory.test.js`）
- [ ] T046b [US3] 建立 Playwright E2E 預期失敗測試（US3 主路徑）：選定任一設備 → 切換至 30 天範圍 → 驗證趨勢圖顯示資料點；選擇無告警期間 → 驗證顯示「此期間無告警紀錄」文字（`frontend/tests/e2e/device-history.spec.ts`）

### 後端實作

- [ ] T046 [US3] 擴充設備 API：新增 `GET /api/v1/devices/:device_id/history`，依時間範圍自動選擇解析度（≤1d → 5m、≤7d → 1h、>7d → 1d），整合 InfluxDB rp_raw/rp_agg 資料（`backend/src/api/devices.js`）
- [ ] T047 [P] [US3] 擴充設備 API：新增 `GET /api/v1/devices/:device_id/maintenance`，回傳設備保養紀錄清單（依 maintained_at 降序）（`backend/src/api/devices.js`）

### 前端實作

- [ ] T048 [US3] 建立 `useDeviceHistory` React Query Hook，支援 `field`、`from`、`to` 查詢參數（`frontend/src/services/useDeviceHistory.ts`）
- [ ] T049 [P] [US3] 建立 `useDeviceAlerts` React Query Hook，以 `heat_pump_id` 篩選告警歷史，重用 `GET /api/v1/alerts`（`frontend/src/services/useDeviceAlerts.ts`）
- [ ] T050 [US3] 建立單機履歷頁面，含時間範圍選擇器、Recharts LineChart 參數趨勢圖（斷線處理）、保養紀錄清單、告警歷史清單（無資料顯示明確提示文字）（`frontend/src/pages/DeviceHistory/index.tsx`）

**檢查點**：US3 獨立可測試 — 趨勢圖正確顯示指定期間資料，無告警/無保養記錄時顯示明確提示

---

## 第六階段：US4 — 告警中心（P4）

**目標**：集中管理所有告警的確認與解決流程，確保每筆告警都被記錄處理

**獨立測試**：維運人員能看到未處理告警清單、執行確認/解決操作並填寫備註，manager 僅可查看歷史，即視為完整可交付

### 測試先行（TDD — 先建立預期失敗測試，確認失敗後進入實作）

- [ ] T051a [P] [US4] 建立後端整合預期失敗測試：驗證 `PATCH /api/v1/alerts/:id/acknowledge` 在 `operator` 角色時正確更新 `acknowledged_at` 與 `acknowledged_by`；`manager` 角色時回傳 HTTP 403（`backend/tests/integration/alerts.test.js`）
- [ ] T051b [US4] 建立 Playwright E2E 預期失敗測試（US4 主路徑）：以 operator 進入告警中心 → 確認一筆未處理告警 → 驗證移至已確認清單；輸入解決備註 → 驗證備註儲存；切換 manager 角色 → 驗證無操作按鈕（`frontend/tests/e2e/alert-center.spec.ts`）

### 後端實作

- [ ] T051 [US4] 建立告警 API 路由：`GET /api/v1/alerts`（支援 status/site_id/heat_pump_id/alert_type/from/to 篩選與分頁）、`POST /api/v1/alerts`（operator-only，手動建立）、`PATCH /api/v1/alerts/:id/acknowledge`（operator-only）、`PATCH /api/v1/alerts/:id/resolve`（operator-only，含 resolution_notes 儲存）（`backend/src/api/alerts.js`）

### 前端實作

- [ ] T052 [US4] 建立 `useAlerts` React Query Hook，含 acknowledge/resolve `useMutation` 與告警清單查詢（`frontend/src/services/useAlerts.ts`）
- [ ] T053 [US4] 建立告警中心頁面，含未處理/已確認/已解決分頁清單、場域/設備/類型篩選器、確認與解決操作 Modal（manager 角色自動隱藏寫入按鈕）（`frontend/src/pages/AlertCenter/index.tsx`）

**檢查點**：US4 獨立可測試 — 告警清單正確分頁，operator 可確認/解決，manager 無寫入操作

---

## 第七階段：US5 — 月報雛形（P5）

**目標**：依場域與月份產生設備運行月報，支援列印為 PDF 下載

**獨立測試**：管理人員選擇場域與月份後，系統產生含可用率、告警統計的月報 HTML 預覽，且可使用瀏覽器列印功能輸出為 PDF，即視為完整可交付

### 測試先行（TDD — 先建立預期失敗測試，確認失敗後進入實作）

- [ ] T054a [P] [US5] 建立後端單元預期失敗測試：依 spec.md FR-013 定義驗證 `reportService.js` 可用率計算公式（以 `status_snapshots` 計算，不得只讀 `current_status`）；驗證月中新增設備自 `monitoring_started_at` 開始計算分母、月中移除設備計算至 `monitoring_ended_at` 或最後納入監控時間；驗證當月無異常時 HTML 輸出包含「本月無異常事件」字串（`backend/tests/unit/reportService.test.js`）
- [ ] T054b [US5] 建立 Playwright E2E 預期失敗測試（US5 主路徑）：選擇「拉拉手游泳學院」+ 當前月份 → 觸發產生 → 驗證月報 HTML 預覽顯示含可用率與告警統計；驗證「列印 / 另存 PDF」按鈕觸發 `window.print()`（不驗證服務端 PDF 下載）（`frontend/tests/e2e/monthly-report.spec.ts`）

### 後端實作

- [ ] T054 [US5] 建立 ejs 月報模板，含場域設備可用率、告警次數、告警類型分布表格、重大事件摘要，加入 `@media print` CSS 控制列印頁眉/頁尾/分頁（頁首含場域名稱與報告月份）（`backend/src/templates/monthly-report.ejs`）
- [ ] T055 [US5] 建立月報服務，從 MySQL 聚合月度告警統計（total/critical 計數）；依 `status_snapshots` 計算可用率（`status ∉ {fault, offline}` 的 5 分鐘區間數 ÷ 該設備在該月份實際納入監控期間的 5 分鐘區間數），監控期間以 `max(月初, monitoring_started_at)` 到 `min(次月月初, monitoring_ended_at 或次月月初)` 計算；報告月份內有設備新增或移除時，於 HTML 標示設備數量曾變動；不得只讀 `heat_pumps.current_status`；渲染 ejs 模板為 HTML 字串（`backend/src/services/reportService.js`）
- [ ] T056 [US5] 建立月報 API 路由：`POST /api/v1/reports/monthly`（manager-only，UPSERT 語義：同場域同月份已存在則更新）、`GET /api/v1/reports/monthly/:id`、`GET /api/v1/reports/monthly`（支援 site_id/year 篩選）（`backend/src/api/reports.js`）

### 前端實作

- [ ] T057 [US5] 建立 `useMonthlyReport` React Query Hook，含月報產生 `useMutation`（`frontend/src/services/useMonthlyReport.ts`）
- [ ] T058 [US5] 建立月報頁面，含場域/月份選擇器、月報 HTML 預覽（`dangerouslySetInnerHTML`）、`@media print` 列印樣式（頁首含場域名稱與報告月份）、「列印 / 另存 PDF」按鈕呼叫 `window.print()`；不實作服務端 PDF 下載（`frontend/src/pages/MonthlyReport/index.tsx`）

**檢查點**：US5 獨立可測試 — 月報預覽正確顯示，列印 PDF 版面正常，無告警月份顯示「本月無異常事件」

---

## 第八階段：US6 — 老闆決策頁（P6）

**目標**：提供跨場域整體健康度彙整視圖，含本月與上月告警環比趨勢

**獨立測試**：高層管理者能在單一頁面看到所有場域設備健康度摘要（正常/警告/異常台數）、本月告警總數與上月比較，點選場域可跳轉設備總覽篩選視圖，即視為完整可交付

### 測試先行（TDD — 先建立預期失敗測試，確認失敗後進入實作）

- [ ] T059a [P] [US6] 建立後端單元預期失敗測試：驗證 `dashboardService.js` 跨場域統計聚合正確（normal/warning/fault/offline 計數總和 = 80）；驗證環比計算在上月 0 告警時不產生除零錯誤；驗證某場域本月告警數較上月增加至少 30% 且增加至少 3 筆時回傳需關注標記（`backend/tests/unit/dashboardService.test.js`）
- [ ] T059b [US6] 建立 Playwright E2E 預期失敗測試（US6 主路徑）：以 manager 角色進入老闆決策頁 → 驗證 3 個場域統計卡顯示 → 點選場域名稱 → 驗證跳轉至設備總覽並套用場域篩選（`frontend/tests/e2e/executive-dashboard.spec.ts`）

### 後端實作

- [ ] T059 [US6] 建立儀表板服務，聚合跨場域設備健康度統計（normal/warning/fault/offline 計數）、本月與上月告警數環比，並依「增加至少 30% 且增加至少 3 筆」規則標記需關注場域（`backend/src/services/dashboardService.js`）
- [ ] T060 [US6] 建立老闆決策頁 API 路由 `GET /api/v1/dashboard/summary`，回傳 overall 彙總、各場域明細與需關注標記（`backend/src/api/dashboard.js`）

### 前端實作

- [ ] T061 [US6] 建立 `useDashboardSummary` React Query Hook，60 秒自動刷新（`frontend/src/services/useDashboardSummary.ts`）
- [ ] T062 [US6] 建立老闆決策頁，含整體健康度統計卡、各場域告警環比 Recharts BarChart（依需關注標記視覺化突顯異常場域）、點選場域名稱導航至設備總覽頁面（`frontend/src/pages/ExecutiveDashboard/index.tsx`）

**檢查點**：US6 獨立可測試 — 跨場域統計卡正確、環比趨勢柱狀圖顯示，點選場域可導航

---

## 最終階段：完善與跨功能關注點

**目的**：補全跨頁面整合、部署設定與端到端驗收

- [ ] T063 [P] 建立 InfluxDB 保存策略與連續查詢初始化腳本（rp_raw 保留 365 天、rp_agg 保留無限期、兩個 CQ）（`backend/db/influxdb-setup.sh`）
- [ ] T064 [P] 建立 Nginx 反向代理設定：`/` → React 靜態檔案（`/var/www/heatpump/dist`），`/api` → Node.js Express Port 3001（`nginx.conf`）
- [ ] T065 [P] 補充 Seeder：每台真實設備加入 5 筆保養紀錄 + 各場域加入 10 筆歷史告警（含 open/resolved 混合狀態），支援 US3/US4 UI 驗收（`backend/db/seeders/002-seed-sample-data.js`）
- [ ] T066 [P] 驗證邊界情境：場域所有設備離線時各頁面呈現、只有 1 台設備時風險排序版面、新增第 4 個場域時各頁面自動適應、月報月份內設備新增/移除時依實際納入監控期間計算可用率並標示設備數量變動（根據驗收結果修正 `frontend/src/pages/DeviceOverview/index.tsx`、`frontend/src/pages/RiskRanking/index.tsx`、`frontend/src/pages/MonthlyReport/index.tsx`、`backend/src/services/reportService.js`）
- [ ] T067 依 `quickstart.md` 執行完整驗收流程：Migration → Seed → InfluxDB 初始化 → Node-RED 匯入流程 → 後端啟動 → 前端啟動 → 6 頁面逐一驗收情境；確認 80 台設備在設備總覽、風險排序、老闆決策頁皆能正確呈現（`specs/001-heatpump-dashboard-6pages/quickstart.md`）
- [ ] T068 [P] 建立效能測試腳本：驗證設備總覽頁 80 台設備完整載入 ≤ 3 秒；使用 Playwright 計時或 Lighthouse CI 門檻強制驗收（`frontend/tests/e2e/performance.spec.ts`）
- [ ] T069 [P] 建立月報效能測試：驗證任一場域任一月份月報產生 ≤ 30 秒（含後端 API 回應時間）（`backend/tests/integration/reportPerformance.test.js`）
- [ ] T070 [P] 建立 API 效能測試腳本：主要 API（`/devices`、`/alerts`、`/risks`、`/dashboard/summary`）P95 回應 ≤ 500ms；整合至 CI gate（`backend/tests/performance/api-p95.test.js`）
- [ ] T071 [P] 補全共用元件無障礙功能：`StatusDot`、`Badge`、所有互動元件加入 `aria-label`、`role`、鍵盤焦點樣式（`frontend/src/components/`）
- [ ] T072 [P] 建立 Playwright + axe 無障礙測試：掃描 6 頁主要流程，確認無嚴重等級無障礙違規（符合 WCAG 2.1 AA）（`frontend/tests/e2e/accessibility.spec.ts`）

---

## 依賴關係與執行順序

### 階段依賴

- **第一階段（專案初始化）**：無依賴，立即開始
- **第二階段（基礎建設）**：依賴第一階段完成，**阻塞第三至八階段所有工作**
- **第三至八階段（US1–US6）**：均依賴第二階段完成
  - 建議依優先順序：P1 → P2 → P3 → P4 → P5 → P6
  - 若有多人力，各故事可在基礎建設完成後平行開發
- **最終階段（完善）**：依賴所有使用者故事完成

### 使用者故事相依關係

| 故事 | 跨故事依賴 | 說明 |
|------|-----------|------|
| US1（P1） | 無 | 唯一依賴：第二階段基礎建設 |
| US2（P2） | 無 | `risk_assignments` model 已在第二階段建立 |
| US3（P3） | 軟依賴 US4 | `useDeviceAlerts` 重用 `/api/v1/alerts`；可先以 hook 直接呼叫，不需等 US4 頁面完成 |
| US4（P4） | 無 | `alerts` 資料表與 alertEngine 已在第二階段完成 |
| US5（P5） | 無 | 月報計算依賴 `alerts` 資料，第二階段已就緒 |
| US6（P6） | 資料成熟性 | 技術上無依賴；資料越豐富（US1–US4 完成後）展示效果越好 |

### 故事內部執行順序

```
後端：Service → API 路由（依賴 Model 已在第二階段建立）
前端：React Query Hook → 頁面元件（依賴 api.ts 已在第二階段建立）
```

### 第二階段內部平行機會

- T008、T009 可與 T007 平行（不同檔案）
- T011–T016（Migrations）：T010 完成後可全部平行
- T017–T022（Models）：T010 完成後可全部平行
- T025、T026 可平行（不同服務檔案）
- T031–T036（前端基礎）可全部平行

---

## 平行執行範例：US1（設備總覽）

```
TDD 先行（單人或雙人均先執行）
─────────────────────────────────────────────────
T037a/b/c 建立預期失敗測試（確認失敗後再進入實作）

後端開發者                           前端開發者
─────────────────────────────────────────────────
T037 建立 sites.js              →   T040 建立 useSites.ts
T038 建立 deviceService.js      →   T041 [P] 建立 useDevices.ts
T039 [P] 建立 devices.js            （T040、T041 完成後）
     GET /devices、GET /:id     →   T042 建立 DeviceOverview 頁面
```

---

## 實作策略

### MVP 範圍（建議首次交付）

完成 **T001–T042**（第一至三階段，含 TDD 預期失敗測試 T037a/b/c）即構成可驗收的 MVP：

- 後端：sites API、devices API、mockDataService、alertEngine（排程運作）
- 前端：設備總覽頁面顯示 80 台設備狀態、降級提示橫幅、角色切換 UI

**MVP 驗收標準**：7 台真實設備狀態卡正常顯示、手動斷開 InfluxDB 後頁面顯示降級提示、角色切換後 `X-Role` 標頭正確傳送

### 增量交付計畫

| 迭代 | 涵蓋任務 | 交付內容 |
|------|---------|---------|
| 迭代 1（MVP） | T001–T042 | 設備總覽可運作（含 TDD 預期失敗測試） |
| 迭代 2 | T043a–T045 | + 風險排序 |
| 迭代 3 | T046a–T050 | + 單機履歷 |
| 迭代 4 | T051a–T053 | + 告警中心 |
| 迭代 5 | T054a–T058 | + 月報雛形 |
| 迭代 6 | T059a–T062 | + 老闆決策頁 |
| 迭代 7 | T063–T072 | 完善與部署驗收（含效能測試與無障礙驗收） |
