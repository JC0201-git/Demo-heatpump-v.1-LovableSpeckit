---
description: "熱泵設備監控儀表板 — 可執行任務清單"
---

# 任務清單：熱泵設備監控儀表板（6 頁面）

**功能分支**：`001-heatpump-dashboard-6pages`
**輸入文件**：`specs/001-heatpump-dashboard-6pages/`（spec.md、plan.md、data-model.md、contracts/rest-api.md、research.md、quickstart.md）
**產生日期**：2026-05-24

## 格式

- `[P]`：可平行執行（不同檔案、無未完成任務依賴）
- `[US#]`：所屬使用者故事；初始化與基礎建設任務不加故事標籤
- 每個使用者故事必須先建立預期失敗測試並確認失敗，再進入實作

---

## 第一階段：專案初始化

- [ ] T001 依實作計畫建立後端目錄結構（`backend/src/{api,models,services,middleware,jobs,templates}/`、`backend/db/{migrations,seeders}/`、`backend/tests/`）
- [ ] T002 [P] 依實作計畫建立前端目錄結構（`frontend/src/{components,pages/{DeviceOverview,RiskRanking,DeviceHistory,AlertCenter,MonthlyReport,ExecutiveDashboard},services,contexts,theme,utils}/`、`frontend/tests/`）
- [ ] T003 初始化後端 Node.js 專案，設定 npm `save-exact=true`，以精確版本安裝 express、sequelize、mysql2、node-influx、node-cron、ejs、@faker-js/faker、axios、dotenv、cors、sequelize-cli、jest、nodemon（`backend/package.json`、`backend/package-lock.json`）
- [ ] T004 [P] 初始化前端 React + TypeScript 專案，設定 npm `save-exact=true`，以精確版本安裝 @tanstack/react-query、react-router-dom、recharts、dayjs、vitest、@playwright/test（`frontend/package.json`、`frontend/package-lock.json`）
- [ ] T005 [P] 建立後端環境變數範本，涵蓋 PORT、DB_HOST/PORT/NAME/USER/PASS、INFLUXDB_HOST/PORT/DATABASE、NODERED_BASE_URL、ALERT_CHECK_INTERVAL_MINUTES、DEVICE_OFFLINE_THRESHOLD_MINUTES（`backend/.env.example`）
- [ ] T006 [P] 設定後端與前端 ESLint + Prettier（`backend/.eslintrc.json`、`backend/.prettierrc`、`frontend/.eslintrc.json`、`frontend/.prettierrc`）
- [ ] T006b [P] 建立 CI 與品質閘門：lint、unit/integration/E2E coverage >= 80%、精確依賴檢查、6 頁 Lighthouse CI、Playwright screenshot/visual regression、bundle gzip 增量 <= 10 kB（`.github/workflows/ci.yml`、`.lighthouserc.json`、`scripts/check-exact-deps.mjs`、`frontend/scripts/check-bundle-budget.mjs`、`frontend/bundle-budget.json`）

---

## 第二階段：基礎建設（阻塞所有使用者故事）

### 後端 Express 應用程式

- [ ] T007 建立 Express 應用程式進入點，含 CORS、JSON parser、路由掛載骨架、PM2 啟動設定（`backend/src/app.js`）
- [ ] T007a [P] 建立 roleGuard 預期失敗測試：缺少 `X-Role`、角色值無效、角色不符合端點要求皆回傳 HTTP 403；不得預設為 operator（`backend/tests/unit/roleGuard.test.js`）
- [ ] T008 建立角色守衛中間件，讀取 `X-Role` 驗證 `operator`/`manager`，並支援月報 manager 報表操作例外（`backend/src/middleware/roleGuard.js`）
- [ ] T009 [P] 建立全域錯誤處理中間件，依 REST API 契約輸出 `{ success: false, error: { code, message } }`（`backend/src/middleware/errorHandler.js`）
- [ ] T010 建立 Sequelize 設定檔與 sequelize-cli 初始化設定，含 development/production 環境區分（`backend/src/config/database.js`、`backend/.sequelizerc`）

### MySQL Migration 與 Sequelize Model

- [ ] T011 建立 Migration：`sites`，含 `site_code` UNIQUE、name、address、contact、phone、is_active、created_at、updated_at（`backend/db/migrations/001-create-sites.js`）
- [ ] T012 [P] 建立 Migration：`heat_pumps`，含 `device_id` UNIQUE、`is_mock`、`installed_at`、`monitoring_started_at`、`monitoring_ended_at`、`is_active`、`current_status`、`status_updated_at`、`idx_monitoring_window`（`backend/db/migrations/002-create-heat-pumps.js`）
- [ ] T013 [P] 建立 Migration：`risk_assignments`，含 `risk_level` ENUM（high/medium/low）、`assigned_by`、`assigned_at`、notes、`is_current`、FK→heat_pumps（`backend/db/migrations/003-create-risk-assignments.js`）
- [ ] T014 [P] 建立 Migration：`alerts`，含 `alert_type` ENUM、`severity` ENUM（critical/warning/info）、`status` ENUM、觸發/確認/解決生命週期欄位（`backend/db/migrations/004-create-alerts.js`）
- [ ] T015 [P] 建立 Migration：`maintenance_records`，含 maintained_at、technician、maintenance_type、summary、parts_replaced、next_scheduled（`backend/db/migrations/005-create-maintenance-records.js`）
- [ ] T016 [P] 建立 Migration：`monthly_reports`，含 UNIQUE KEY `(site_id, report_year, report_month)`、availability_pct、total_alerts、critical_alerts、summary_html MEDIUMTEXT（`backend/db/migrations/006-create-monthly-reports.js`）
- [ ] T016b [P] 建立 Migration：`status_snapshots`，含 `(heat_pump_id, snapshot_at)` 唯一鍵、狀態 ENUM、source、索引，作為 FR-014 月報可用率唯一來源（`backend/db/migrations/007-create-status-snapshots.js`）
- [ ] T017 建立 Sequelize Model：`Site`，含 `site_code` 與 `hasMany(HeatPump)`、`hasMany(MonthlyReport)`（`backend/src/models/site.js`）
- [ ] T018 [P] 建立 Sequelize Model：`HeatPump`，含 `is_mock`、`monitoring_started_at`、`monitoring_ended_at`、`status_updated_at` 與關聯（`backend/src/models/heatPump.js`）
- [ ] T019 [P] 建立 Sequelize Model：`RiskAssignment`，含 `is_current` 業務規則說明（`backend/src/models/riskAssignment.js`）
- [ ] T020 [P] 建立 Sequelize Model：`Alert`，含 `severity`、生命週期 ENUM 與所有時間戳欄位（`backend/src/models/alert.js`）
- [ ] T021 [P] 建立 Sequelize Model：`MaintenanceRecord`，定義 `belongsTo(HeatPump)`（`backend/src/models/maintenanceRecord.js`）
- [ ] T022 [P] 建立 Sequelize Model：`MonthlyReport`，定義 `belongsTo(Site)`（`backend/src/models/monthlyReport.js`）
- [ ] T022b [P] 建立 Sequelize Model：`StatusSnapshot`，定義唯一性、狀態 ENUM 與 `belongsTo(HeatPump)`（`backend/src/models/statusSnapshot.js`）
- [ ] T023 建立種子資料腳本：3 個場域含唯一 `site_code`、3 台真實設備（`is_mock=0`）、77 台模擬設備（`is_mock=1`）、`SITExx-xxx` device_id、監控起訖欄位與固定 faker seed（`backend/db/seeders/001-sites-and-devices.js`）

### InfluxDB、Node-RED、模擬資料

- [ ] T063 [P] 建立 InfluxDB 保存策略與連續查詢初始化腳本（rp_raw 保留 365 天、rp_agg 保留無限期、heatpump 1h/1d CQ）（`backend/db/influxdb-setup.sh`）
- [ ] T024 建立 Node-RED InfluxDB 查詢流程，暴露 latest/history/power-meter 端點供後端 localhost 內部呼叫（`node-red/flows.json`）
- [ ] T025 建立 InfluxDB 串接服務，透過 Node-RED 查詢 `heatpump_status`，連線失敗時回傳 `degraded` 與最後已知資料（`backend/src/services/influxService.js`）
- [ ] T026 [P] 建立模擬資料服務，依 `device_id` 動態生成 temp_inlet/temp_outlet、pressure_high/pressure_low、current_a、power_kw、error_code，僅供 `is_mock=1` 設備使用（`backend/src/services/mockDataService.js`）

### 告警引擎與系統健康度

- [ ] T026a [P] 建立 alertEngine 預期失敗測試：超過 5 分鐘無資料時產生離線告警（`backend/tests/unit/alertEngine.test.js`）
- [ ] T026b [P] 建立 alertEngine 預期失敗測試：`error_code != 0` 時產生錯誤碼告警（`backend/tests/unit/alertEngine.test.js`）
- [ ] T026c [P] 建立 alertEngine 預期失敗測試：溫度、壓力、current_a warning/critical 門檻觸發對應設備狀態與 `severity`（`backend/tests/unit/alertEngine.test.js`）
- [ ] T026d [P] 建立 statusUpdater 預期失敗測試：排程重跑不產生重複未解決告警（`backend/tests/unit/statusUpdater.test.js`）
- [ ] T026e [P] 建立 statusUpdater 預期失敗測試：排程失敗後下一次成功可補偵測遺漏告警（`backend/tests/unit/statusUpdater.test.js`）
- [ ] T027 建立告警引擎，實作離線、錯誤碼、溫度/壓力/current_a 門檻超限規則，寫入含 `severity` 的 alerts（`backend/src/services/alertEngine.js`）
- [ ] T028 建立 node-cron 排程任務，每 5 分鐘掃描監控期間內設備、呼叫告警引擎、更新 `current_status`/`status_updated_at`、寫入 `status_snapshots`（`backend/src/jobs/statusUpdater.js`）
- [ ] T029 建立系統健康度路由 `GET /api/v1/system/health`，回傳 MySQL、InfluxDB/Node-RED 狀態與時間戳（`backend/src/api/system.js`）
- [ ] T029a 建立唯讀告警查詢 API：`GET /api/v1/alerts`，支援 status/site_code/device_id/alert_type/from/to/severity 篩選與分頁（`backend/src/api/alerts.js`）

### 前端基礎框架

- [ ] T030 建立前端入口，設定 React Router 六頁路由骨架，掛載 React Query Provider 與 RoleContext Provider（`frontend/src/main.tsx`、`frontend/src/App.tsx`）
- [ ] T031 [P] 建立 `RoleContext`，含 localStorage、角色切換下拉選單、`X-Role` 標頭自動注入（`frontend/src/contexts/RoleContext.tsx`）
- [ ] T032 [P] 建立設計 token，定義設備狀態顏色、字型、間距、焦點樣式（`frontend/src/theme/tokens.ts`）
- [ ] T033 [P] 建立狀態元件：`StatusDot`、`Badge`、`DataStateBanner`（`frontend/src/components/StatusDot.tsx`、`frontend/src/components/Badge.tsx`、`frontend/src/components/DataStateBanner.tsx`）
- [ ] T033a [P] 建立共享互動元件庫：`Button`、`IconButton`、`Modal`、`FormField`、`Select`、`Tabs`、`Navigation`、`PageState`，含 aria、鍵盤焦點狀態、loading 狀態與 page data states；使用者動作後 100ms 內必須顯示 loading feedback（`frontend/src/components/`）
- [ ] T033b [P] 建立共享元件預期失敗測試：驗證 Button/Form/PageState loading 狀態、disabled 防重送、aria-busy、100ms 內 loading feedback（`frontend/tests/unit/shared-components.test.tsx`）
- [ ] T034 [P] 建立工具函數：缺欄位回退顯示、dayjs 日期格式化、ISO 8601 時間解析（`frontend/src/utils/format.ts`）
- [ ] T035 建立 API 請求基礎函數，自動附加 `X-Role`、解析 `{ success, data, degraded }`、統一錯誤拋出（`frontend/src/services/api.ts`）
- [ ] T036 [P] 建立系統健康度 Hook，每 10 秒輪詢 health；API 回傳 `degraded:true` 或請求失敗時更新 `isDegraded`（`frontend/src/services/useSystemHealth.ts`）

---

## 第三階段：US1 — 設備總覽（P1）

- [ ] T037a [P] [US1] 建立後端單元預期失敗測試：`deviceService.js` 在 `degraded=true` 時回傳最後已知資料與 `data_quality`（`backend/tests/unit/deviceService.test.js`）
- [ ] T037b [P] [US1] 建立前端單元預期失敗測試：`useDevices` 正確傳遞 `isDegraded` 至 UI（`frontend/tests/unit/useDevices.test.ts`）
- [ ] T037c [US1] 建立 Playwright E2E 預期失敗測試：顯示 3 場域、80 台設備、至少 7 台代表設備；health down 時顯示降級橫幅（`frontend/tests/e2e/device-overview.spec.ts`）
- [ ] T037d [P] [US1] 建立後端整合預期失敗測試：operator 可新增第 4 場域/設備與更新監控期間；manager 與缺 `X-Role` 回傳 403（`backend/tests/integration/siteDeviceManagement.test.js`）
- [ ] T037e [US1] 建立 Playwright E2E 預期失敗測試：新增第 4 場域與設備後，設備總覽資料驅動顯示（`frontend/tests/e2e/device-overview-site-expansion.spec.ts`）
- [ ] T037f [US1] 建立 Playwright E2E 預期失敗測試：某場域全數離線時標示「全數離線」與最後更新時間（`frontend/tests/e2e/device-overview-edge-cases.spec.ts`）
- [ ] T037 [US1] 建立場域 API：`GET /api/v1/sites`，回傳啟用場域與狀態統計；`site_code` 必須出現在回應（`backend/src/api/sites.js`）
- [ ] T038 [US1] 建立裝置服務，整合 MySQL、InfluxDB/Mock 即時資料，回傳含 `status_updated_at`、`data_quality`、`degraded` 的設備物件（`backend/src/services/deviceService.js`）
- [ ] T039 [P] [US1] 建立設備 API：`GET /api/v1/devices`、`GET /api/v1/devices/:device_id`，支援 site_code/status 篩選與分頁（`backend/src/api/devices.js`）
- [ ] T039a [US1] 建立場域與設備管理 API：`POST /api/v1/sites`、`POST /api/v1/devices`、`PATCH /api/v1/devices/:device_id`，operator-only（`backend/src/api/sites.js`、`backend/src/api/devices.js`）
- [ ] T040 [US1] 建立 `useSites` Hook，60 秒刷新並整合降級旗標（`frontend/src/services/useSites.ts`）
- [ ] T041 [P] [US1] 建立 `useDevices` Hook，支援篩選參數與 60 秒刷新（`frontend/src/services/useDevices.ts`）
- [ ] T042 [US1] 建立設備總覽頁面，使用共享元件呈現場域分組、設備卡、異常醒目標示與降級橫幅（`frontend/src/pages/DeviceOverview/index.tsx`）

---

## 第四階段：US2 — 風險排序（P2）

- [ ] T043a [P] [US2] 建立後端單元預期失敗測試：operator 建立風險指派並關閉舊 `is_current`；manager 回傳 403（`backend/tests/unit/risks.test.js`）
- [ ] T043b [US2] 建立 Playwright E2E 預期失敗測試：operator 指派高風險後清單即時更新；30 秒內可識別高風險設備；manager 無指派按鈕（`frontend/tests/e2e/risk-ranking.spec.ts`）
- [ ] T043c [US2] 建立 Playwright E2E 預期失敗測試：1 台設備、空群組、第 4 場域篩選皆正確顯示（`frontend/tests/e2e/risk-ranking-edge-cases.spec.ts`）
- [ ] T043 [US2] 建立風險排序 API：`GET /api/v1/risks`、`POST /api/v1/risks`，支援 site_code 篩選與 operator-only 指派（`backend/src/api/risks.js`）
- [ ] T044 [US2] 建立 `useRisks` Hook，含風險清單查詢與指派 mutation（`frontend/src/services/useRisks.ts`）
- [ ] T045 [US2] 建立風險排序頁面，使用共享 Modal/Form/Button，顯示高/中/低分組與指派資訊（`frontend/src/pages/RiskRanking/index.tsx`）

---

## 第五階段：US3 — 單機履歷（P3）

- [ ] T046a [P] [US3] 建立後端單元預期失敗測試：history API 依範圍切換解析度（<=1d: 5m、<=7d: 1h、>7d: 1d）（`backend/tests/unit/deviceHistory.test.js`）
- [ ] T046b [US3] 建立 Playwright E2E 預期失敗測試：30 天趨勢圖有資料點；無告警期間顯示明確文字（`frontend/tests/e2e/device-history.spec.ts`）
- [ ] T046 [US3] 擴充設備 API：`GET /api/v1/devices/:device_id/history`，整合 InfluxDB rp_raw/rp_agg（`backend/src/api/devices.js`）
- [ ] T047 [P] [US3] 擴充設備 API：`GET /api/v1/devices/:device_id/maintenance`，依 maintained_at 降序（`backend/src/api/devices.js`）
- [ ] T048 [US3] 建立 `useDeviceHistory` Hook，支援 field/from/to（`frontend/src/services/useDeviceHistory.ts`）
- [ ] T049 [P] [US3] 建立 `useDeviceAlerts` Hook，重用 `GET /api/v1/alerts` 並支援 severity 篩選（`frontend/src/services/useDeviceAlerts.ts`）
- [ ] T050 [US3] 建立單機履歷頁面，使用共享元件呈現範圍選擇、Recharts 趨勢圖、保養與告警清單（`frontend/src/pages/DeviceHistory/index.tsx`）

---

## 第六階段：US4 — 告警中心（P4）

- [ ] T051a [P] [US4] 建立後端整合預期失敗測試：operator 可 acknowledge；manager 回傳 403；`severity` 保留（`backend/tests/integration/alerts.test.js`）
- [ ] T051b [US4] 建立 Playwright E2E 預期失敗測試：operator 確認/解決告警並儲存備註；manager 無操作按鈕（`frontend/tests/e2e/alert-center.spec.ts`）
- [ ] T051c [US4] 建立延遲整合預期失敗測試：排程偵測告警後 5 分鐘內可由 `GET /api/v1/alerts` 查到（`backend/tests/integration/alertLatency.test.js`）
- [ ] T051 [US4] 擴充告警 API：`POST /api/v1/alerts`、`PATCH /api/v1/alerts/:id/acknowledge`、`PATCH /api/v1/alerts/:id/resolve`，operator-only，保存 `severity` 與 resolution_notes（`backend/src/api/alerts.js`）
- [ ] T052 [US4] 建立 `useAlerts` Hook，含查詢、acknowledge/resolve mutation 與 severity 篩選（`frontend/src/services/useAlerts.ts`）
- [ ] T053 [US4] 建立告警中心頁面，使用共享 Tabs/Modal/Form/Button，含狀態分頁、篩選器與角色隱藏寫入按鈕（`frontend/src/pages/AlertCenter/index.tsx`）

---

## 第七階段：US5 — 月報雛形（P5）

- [ ] T054a [P] [US5] 建立後端單元預期失敗測試：FR-013 可用率、監控期間分母、無異常文案、不得只讀 `current_status`（`backend/tests/unit/reportService.test.js`）
- [ ] T054b [US5] 建立 Playwright E2E 預期失敗測試：manager 產生月報、預覽可用率/告警統計、列印按鈕觸發 `window.print()`（`frontend/tests/e2e/monthly-report.spec.ts`）
- [ ] T054c [US5] 建立 Playwright E2E 預期失敗測試：新增第 4 場域後，月報場域選單自動顯示（`frontend/tests/e2e/monthly-report-site-expansion.spec.ts`）
- [ ] T054 [US5] 建立 ejs 月報模板，含可用率、告警次數、`critical` 告警、類型分布、重大事件、無異常文案、print CSS（`backend/src/templates/monthly-report.ejs`）
- [ ] T055 [US5] 建立月報服務，依 `status_snapshots` 計算可用率，聚合 total/critical 告警，標示設備數量變動並渲染 HTML（`backend/src/services/reportService.js`）
- [ ] T056 [US5] 建立月報 API：`POST /api/v1/reports/monthly`（manager 報表操作例外，UPSERT 快取）、`GET /api/v1/reports/monthly/:id`、`GET /api/v1/reports/monthly`（`backend/src/api/reports.js`）
- [ ] T057 [US5] 建立 `useMonthlyReport` Hook，含月報產生 mutation 與查詢（`frontend/src/services/useMonthlyReport.ts`）
- [ ] T058 [US5] 建立月報頁面，使用共享 Form/Button，含場域/月份選擇、HTML 預覽與 `window.print()`（`frontend/src/pages/MonthlyReport/index.tsx`）

---

## 第八階段：US6 — 老闆決策頁（P6）

- [ ] T059a [P] [US6] 建立後端單元預期失敗測試：跨場域統計總和 = 80、上月 0 告警不除零、需關注規則正確（`backend/tests/unit/dashboardService.test.js`）
- [ ] T059b [US6] 建立 Playwright E2E 預期失敗測試：manager 查看 3 場域統計並點選場域導向設備總覽篩選（`frontend/tests/e2e/executive-dashboard.spec.ts`）
- [ ] T059c [US6] 建立 Playwright E2E 預期失敗測試：新增第 4 場域與設備後，決策頁自動顯示並可導向篩選視圖（`frontend/tests/e2e/executive-dashboard-site-expansion.spec.ts`）
- [ ] T059 [US6] 建立儀表板服務，聚合健康度、告警環比與需關注標記（`backend/src/services/dashboardService.js`）
- [ ] T060 [US6] 建立老闆決策頁 API：`GET /api/v1/dashboard/summary`（`backend/src/api/dashboard.js`）
- [ ] T061 [US6] 建立 `useDashboardSummary` Hook，60 秒自動刷新（`frontend/src/services/useDashboardSummary.ts`）
- [ ] T062 [US6] 建立老闆決策頁，使用共享元件呈現統計卡、Recharts BarChart、場域導覽（`frontend/src/pages/ExecutiveDashboard/index.tsx`）

---

## 最終階段：完善與跨功能關注點

- [ ] T064 [P] 建立 Nginx 反向代理設定：`/` → React 靜態檔案、`/api` → Node.js Express Port 3001（`nginx.conf`）
- [ ] T065 [P] 補充 Seeder：每台真實設備 5 筆保養紀錄、各場域 10 筆歷史告警，含 severity 與 open/resolved 混合狀態（`backend/db/seeders/002-seed-sample-data.js`）
- [ ] T066 [P] 驗證邊界情境並修正：全數離線、1 台設備、第四場域、月中新增/移除設備（`frontend/src/pages/DeviceOverview/index.tsx`、`frontend/src/pages/RiskRanking/index.tsx`、`frontend/src/pages/MonthlyReport/index.tsx`、`backend/src/services/reportService.js`）
- [ ] T067 依 `quickstart.md` 執行完整驗收流程，確認 80 台設備在設備總覽、風險排序、老闆決策頁皆正確呈現（`specs/001-heatpump-dashboard-6pages/quickstart.md`）
- [ ] T068 [P] 建立設備總覽效能測試：80 台設備完整載入 <= 3 秒（`frontend/tests/e2e/performance.spec.ts`）
- [ ] T069 [P] 建立月報效能測試：任一場域任一月份月報產生 <= 30 秒（`backend/tests/integration/reportPerformance.test.js`）
- [ ] T070 [P] 建立 API 效能測試：主要 API P95 <= 500ms 並整合 CI gate（`backend/tests/performance/api-p95.test.js`）
- [ ] T071 [P] 補全共用元件無障礙功能，所有互動元件加入 aria、role、鍵盤焦點樣式（`frontend/src/components/`）
- [ ] T072 [P] 建立 Playwright + axe 無障礙測試，掃描 6 頁主要流程且無嚴重 WCAG 2.1 AA 違規（`frontend/tests/e2e/accessibility.spec.ts`）
- [ ] T073 [P] 建立 Playwright screenshot/visual regression 測試，覆蓋共享元件展示面與 6 頁主要視圖；共享元件變更時此測試必須在 CI 執行（`frontend/tests/e2e/visual-regression.spec.ts`、`frontend/tests/e2e/shared-components-visual.spec.ts`）

---

## 依賴與交付順序

- 第一階段無依賴；第二階段依賴第一階段完成，且阻塞 US1-US6。
- 第二階段中，T010 早於 T011-T022b；T063 早於 T024、T046；T007a 早於 T008。
- US1-US6 建議依 P1 -> P6 交付；基礎建設完成後可多人平行。
- 每個故事內部順序：預期失敗測試 -> 後端 Service/API -> 前端 Hook -> 頁面 -> 驗收。
- MVP 範圍：T001-T042，需顯示 80 台設備、降級提示與角色切換。
