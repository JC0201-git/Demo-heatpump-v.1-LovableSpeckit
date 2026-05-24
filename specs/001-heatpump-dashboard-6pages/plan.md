# 實作計畫：熱泵設備監控儀表板

**分支**：`001-heatpump-dashboard-6pages` | **日期**：2026-05-23 | **規格**：[spec.md](./spec.md)

**輸入**：功能規格 `/specs/001-heatpump-dashboard-6pages/spec.md`

---

## 摘要

為設備商內部維運團隊建立 6 頁熱泵設備監控儀表板：設備總覽、風險排序、單機履歷、告警中心、月報雛形、老闆決策頁。系統採前後端分離：React + TypeScript 前端、Node.js Express 後端，資料層為 MySQL 8.0（業務資料）與 InfluxDB 1.8（時序資料），Node-RED 作為 InfluxDB 內部查詢轉接層。

v1 基準規模為 80 台設備、3 個場域、2 種角色。正式登入/JWT、手機/平板支援、服務端 PDF 生成、Excel 匯出與完整備份自動化列為 v2 或本階段外。

---

## 技術背景

**語言/版本**：Node.js 18 LTS、React + TypeScript。

**主要依賴**：
- 後端：Express、Sequelize、mysql2、node-influx、node-cron、ejs、@faker-js/faker、axios、dotenv、cors
- 前端：TanStack Query、React Router、Recharts、dayjs
- 測試：Jest、Vitest、Playwright、Lighthouse CI、axe

**依賴鎖定政策**：所有 npm 執行期依賴與 `devDependencies` 必須使用精確版本安裝並提交鎖定檔；`package.json` 不得出現 `^`、`~`、`x`、`*` 等浮動版本範圍；CI 必須使用 `npm ci` 並檢查依賴版本鎖定。

**目標平台**：桌面瀏覽器（寬度 >= 1280px）、Ubuntu EC2（AWS）。

**限制條件**：
- 前端不得直接呼叫 InfluxDB 或 MySQL。
- MySQL、InfluxDB、Node-RED 不得公開暴露。
- v1 不做正式登入驗證；以 `X-Role` 標頭做 Demo 等級角色限制。

---

## 憲法符合性檢查

| 原則 | 狀態 | 落實方式 |
|------|------|----------|
| I. 程式碼品質 | 符合 | ESLint + Prettier、精確版本鎖定、模組化分層；長篇資料模型/API/部署細節移至專責文件 |
| II. 測試優先 | 符合 | 使用者故事先建立預期失敗測試，再進入實作；CI 執行單元、整合與 E2E |
| III. UX 一致性 | 符合 | `frontend/src/theme/tokens.ts` 與共享元件庫統一按鈕、表單、Modal、導覽、分頁與狀態元件 |
| IV. 效能要求 | 符合 | Lighthouse、API P95、月報、設備總覽與 bundle budget 均列入 CI 或驗收任務 |
| V. 文件語言標準 | 符合 | 文件以繁體中文撰寫；英文僅保留於程式碼識別符、命令、路徑、API/library 名稱 |

---

## 架構決策

**原始碼結構**：

```text
frontend/
  src/{components,pages,services,contexts,theme,utils}
  tests/
backend/
  src/{api,models,services,middleware,jobs,templates}
  db/{migrations,seeders}
  tests/
node-red/
  flows.json
```

**部署拓撲**：
- EC2-1：Nginx、React 靜態檔案、Node.js Express、Node-RED。
- EC2-2：MySQL 8.0、InfluxDB 1.8，無公網 IP。
- Nginx `/api` 代理至 Express；Node-RED 僅允許 Express 透過 localhost 呼叫。

部署與本機驗收步驟詳見 [quickstart.md](./quickstart.md)。

---

## 資料模型與時序資料

MySQL 詳細 DDL、索引、關聯、欄位說明與 InfluxDB retention policy / continuous query 由 [data-model.md](./data-model.md) 索引至拆分文件維護。

v1 必須使用下列核心資料表：

| 資料表 | 用途 | 重要要求 |
|------|------|----------|
| `sites` | 客戶場域 | 必須有唯一 `site_code`，例如 `SITE01` |
| `heat_pumps` | 設備主檔 | 必須有 `device_id`、`is_mock`、`current_status`、`status_updated_at`、監控起訖時間 |
| `risk_assignments` | 風險等級歷史 | 每台設備僅一筆 `is_current = 1` |
| `alerts` | 告警生命週期 | 必須有 `alert_type`、`severity`、確認/解決欄位 |
| `maintenance_records` | 保養紀錄 | 供單機履歷查詢 |
| `monthly_reports` | 月報 HTML 與統計快取 | 同一場域同一月份使用 UPSERT |
| `status_snapshots` | 每 5 分鐘狀態快照 | FR-014 指定的月報可用率唯一歷史來源 |

InfluxDB 以 `heatpump_status` 保存 5 分鐘原始讀值，並以 `rp_raw`/`rp_agg` 與連續查詢支援歷史趨勢。`current_a` 與溫度、壓力、功率、`error_code` 同屬 v1 告警與趨勢欄位集合。

---

## API 與角色模型

REST API 詳細端點、請求/回應格式與角色限制由 [contracts/rest-api.md](./contracts/rest-api.md) 索引至拆分文件維護。對外查詢與請求統一使用 `site_code`；MySQL 內部 FK 才使用 `site_id`。

v1 角色規則：
- `operator`（維運人員）：可操作設備總覽、風險排序、單機履歷、告警中心；可新增/更新場域與設備主檔、指派風險、建立/確認/解決告警。
- `manager`（高層管理者）：可存取全部 6 頁；對告警、風險與場域/設備主檔維持唯讀。
- 月報產生是 `manager` 的明確報表操作例外：允許 `POST /api/v1/reports/monthly` 建立或更新月報快取，但不得修改設備、風險或告警營運資料。

所有寫入端點必須明確指定允許角色；缺少 `X-Role` 或角色值無效時一律回傳 HTTP 403，不得預設為 `operator`。

---

## 前端設計約束

前端必須使用共享設計 token 與共享元件庫，避免各頁自行複製互動邏輯。

基礎元件至少包含：
- `Button`、`IconButton`
- `Modal`
- `FormField`、`Select`
- `Tabs`
- `Navigation`
- `StatusDot`
- `Badge`
- `DataStateBanner`

所有互動元件必須支援鍵盤操作、焦點樣式、`aria-label` 或等效語意。6 頁面不得建立與共享元件衝突的 per-page UI 行為。

共享互動元件必須支援 loading 與 page data states；使用者動作後 100ms 內需顯示 loading feedback，並以單元測試或 E2E 驗證。共享元件變更後必須跑 Playwright screenshot/visual regression，覆蓋共享元件展示面與 6 頁主要視圖。

---

## 月報設計

v1 月報採 HTML 預覽與瀏覽器列印：
- 後端以 ejs 渲染 HTML，儲存至 `monthly_reports.summary_html`。
- 前端以預覽區顯示 HTML，按鈕呼叫 `window.print()`。
- 不實作服務端 PDF 生成，不提供 Excel 匯出。

月報可用率必須依 `status_snapshots` 計算，不得只讀 `heat_pumps.current_status`。跨月邊界、月中新增/移除與設備數量變動標示依 [spec.md](./spec.md) FR-013/FR-014 與 [data-model.md](./data-model.md) 規則實作。

---

## 效能與錯誤處理策略

**效能門檻**：
- LCP <= 2.5 秒，TTI <= 3.5 秒。
- 設備總覽 80 台完整顯示 <= 3 秒。
- 主要 API P95 <= 500ms。
- 月報產生 <= 30 秒。
- 資料源中斷降級提示 <= 10 秒。
- 每個 PR 的前端 gzip bundle 增量不得超過 10 kB，除非 PR 明確記錄並核准效能預算例外。

**降級策略**：
- InfluxDB 或 Node-RED 失敗時，後端回傳 `degraded: true` 與 MySQL 最後狀態。
- 前端顯示「資料可能已過時」提示，不得空白或崩潰。
- MySQL 失敗時回傳標準錯誤格式，前端顯示人可理解的全頁錯誤。

---

## 安全與網路

v1 必須落實：
- MySQL / InfluxDB 僅允許 EC2-1 存取。
- Node-RED 僅 localhost 存取。
- Sequelize 使用 parameterized query，避免 SQL Injection。
- 月報 HTML 由後端模板生成，不接受使用者提供的 HTML。
- CORS 限定部署 Origin 與 localhost 開發環境。

v1 的 `X-Role` 僅是 Demo 層級權限控制；v2 替換為正式 JWT/AuthContext。

---

## 開發任務拆解

### 基礎建設（必須最先完成）

1. 專案目錄、npm 精確版本、ESLint/Prettier、CI、bundle budget。
2. MySQL migration/model/seed，含 `site_code`、`is_mock`、`status_updated_at`、`severity`、`status_snapshots`。
3. InfluxDB retention policy 與 continuous query 初始化。
4. Node-RED InfluxDB 串接流程。
5. Express 骨架、錯誤處理、`roleGuard`。
6. React Router、React Query、RoleContext、theme token 與共享元件庫。

### 核心功能（依 spec 優先級）

1. US1 設備總覽：sites/devices API、混合真實/模擬資料、降級提示。
2. US2 風險排序：手動指派、歷史紀錄、operator-only 寫入。
3. US3 單機履歷：歷史趨勢、保養紀錄、告警歷史。
4. US4 告警中心：自動/手動告警、確認、解決、生命週期。
5. US5 月報雛形：HTML 預覽、列印、UPSERT 快取、可用率。
6. US6 老闆決策頁：跨場域健康度、環比、需關注標記。

### 品質保證

每個使用者故事先建立預期失敗測試，再實作服務/API/頁面。最終驗收需包含 6 頁 E2E、主要 API 效能、設備總覽效能、月報效能、Lighthouse、axe 無障礙掃描、Playwright screenshot/visual regression 與 quickstart 完整流程。

---

## 執行順序

1. 第一階段：專案初始化。
2. 第二階段：基礎建設，阻塞所有使用者故事。
3. 第三至八階段：US1 至 US6，建議依 P1 -> P6 交付；基礎建設完成後可多人平行。
4. 最終階段：部署、效能、無障礙與完整驗收。

故事內部順序：

```text
TDD 預期失敗測試 -> 後端 Service/API -> 前端 Hook -> 頁面元件 -> E2E/整合驗收
```

---

## v1 / v2 / 不在範圍

| 功能 | v1 必須實作 | v2 / 不在本階段 |
|------|-------------|----------------|
| 6 頁監控儀表板 | 是 | - |
| 手動風險指派 | 是 | 多指標自動評分 |
| 告警規則 | 離線、錯誤碼、固定門檻、手動告警 | 門檻設定 UI |
| 月報 | HTML 預覽 + `window.print()` | 服務端 PDF、Excel |
| 角色控制 | `X-Role` Demo | JWT / 正式登入 |
| 裝置支援 | 桌面瀏覽器 | 手機/平板 |
| 備份 | 架構預留 | 完整自動備份 |
| 場域擴充 | 架構支援第 4 場域以上 | 超過 v1 規模的容量規劃 |
