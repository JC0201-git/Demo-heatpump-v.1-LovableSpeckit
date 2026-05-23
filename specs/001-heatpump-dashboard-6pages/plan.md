# 實作計畫：熱泵設備監控儀表板

**分支**：`001-heatpump-dashboard-6pages` | **日期**：2026-05-23 | **規格**：[spec.md](./spec.md)

**輸入**：功能規格 `/specs/001-heatpump-dashboard-6pages/spec.md`

---

## 摘要

為設備商內部維運團隊建立熱泵設備監控儀表板，支援 6 個頁面（設備總覽、風險排序、
單機履歷、告警中心、月報雛形、老闆決策頁）。採用前後端分離架構，前端以 React（Lovable 基礎）
搭配 Node.js Express 後端，資料源為 InfluxDB 1.8（時序）與 MySQL（業務資料）。
v1 以 80 台設備（3 台真實 + 77 台 Mock）為基準，支援內部角色切換展示，
不對外公開、不做正式登入驗證。

---

## 技術背景

**語言/版本**：Node.js 18 LTS（後端）、React 18 + TypeScript（前端）

**主要依賴**：
- 後端：Express 4.x、Sequelize 6.x、mysql2、node-influx、node-cron、ejs、@faker-js/faker
- 前端：TanStack Query v5、React Router v6、Recharts、dayjs

**儲存**：MySQL 8.0（業務資料）、InfluxDB 1.8（時序資料）

**測試**：Jest（後端單元 + 整合）、Vitest（前端單元）、Playwright（E2E）

**目標平台**：桌面瀏覽器（≥ 1280px），Ubuntu EC2（AWS）

**專案類型**：內部維運 Web 應用程式（前後端分離）

**效能目標**：
- 設備總覽頁面完整顯示 ≤ 3 秒
- API 回應 P95 ≤ 500ms
- 月報產生 ≤ 30 秒
- 資料源中斷降級提示 ≤ 10 秒

**限制條件**：前端不得直接呼叫 InfluxDB 或 MySQL；資料庫不得公開暴露

**規模範圍**：80 台設備、3 個場域、2 種角色、6 頁面

---

## 憲法符合性檢查

*閘門：Phase 0 研究前必須通過。Phase 1 設計後重新確認。*

| 原則 | 狀態 | 備註 |
|------|------|------|
| I. 程式碼品質 | ✅ 符合 | 採用 ESLint + Prettier；模組化分層；檔案限制 300 行 |
| II. 測試優先 | ✅ 符合 | 規格驗收情境轉為測試案例；需達 ≥ 80% 覆蓋率 |
| III. UX 一致性 | ✅ 符合 | 前端建立共用 theme token；6 頁面使用共用元件庫 |
| IV. 效能要求 | ✅ 符合 | LCP ≤ 2.5s；API P95 ≤ 500ms；降級顯示已設計 |
| V. 文件語言標準 | ✅ 符合 | 所有文件以繁體中文撰寫；程式碼識別符使用英文 |

**Phase 1 重新確認**：通過 — 資料模型、API 契約皆以繁體中文文件化，無原則違反。

---

## 專案結構

### 文件（本功能）

```text
specs/001-heatpump-dashboard-6pages/
├── plan.md              # 本檔案（/speckit.plan 輸出）
├── research.md          # Phase 0 輸出
├── data-model.md        # Phase 1 輸出
├── quickstart.md        # Phase 1 輸出
├── contracts/
│   └── rest-api.md      # Phase 1 輸出
└── tasks.md             # Phase 2 輸出（/speckit.tasks 指令產生）
```

### 原始碼（專案根目錄）

```text
frontend/
├── src/
│   ├── components/        # 共用 UI 元件（Button、Badge、StatusDot 等）
│   ├── pages/             # 6 個頁面元件
│   │   ├── DeviceOverview/
│   │   ├── RiskRanking/
│   │   ├── DeviceHistory/
│   │   ├── AlertCenter/
│   │   ├── MonthlyReport/
│   │   └── ExecutiveDashboard/
│   ├── services/          # React Query hooks（API 請求層）
│   ├── contexts/          # RoleContext
│   ├── theme/             # 設計 token
│   └── utils/             # 工具函數
└── tests/

backend/
├── src/
│   ├── api/               # Express 路由（sites、devices、risks、alerts、reports、dashboard）
│   ├── models/            # Sequelize 模型（MySQL）
│   ├── services/          # 業務邏輯（deviceService、alertEngine、reportService、mockDataService）
│   ├── middleware/        # roleGuard、errorHandler
│   ├── jobs/              # node-cron 排程（statusUpdater）
│   └── templates/         # ejs 月報模板
├── db/
│   ├── migrations/        # Sequelize Migration
│   └── seeders/           # Seed（3 個場域 + 80 台設備）
└── tests/

node-red/
└── flows.json             # Node-RED InfluxDB 串接流程

specs/
└── 001-heatpump-dashboard-6pages/
```

**結構決策**：採用 Web 應用程式分離結構（`frontend/` + `backend/`），
`node-red/` 作為獨立資料串接層設定目錄。

---

## 技術架構總覽

```
瀏覽器（桌面）
     │  HTTPS（Port 443）
     ▼
┌─────────────────────────────── EC2-1 ───────────────────────────────┐
│                                                                      │
│   Nginx（Port 80/443）                                               │
│     ├── /          → React 靜態檔案（/var/www/heatpump/dist）        │
│     └── /api       → 代理至 Node.js Express（Port 3001）             │
│                                                                      │
│   Node.js Express（Port 3001）                                       │
│     ├── REST API 路由（/api/v1/...）                                  │
│     ├── 角色中間件（X-Role Header 驗證）                               │
│     ├── MySQL 存取（透過 Sequelize）                                   │
│     ├── InfluxDB 存取（透過 Node-RED HTTP Endpoint）                  │
│     ├── Mock 資料生成（mockDataService）                               │
│     ├── 告警引擎（node-cron，每 5 分鐘）                               │
│     └── 月報服務（ejs 模板產生 HTML）                                  │
│                                                                      │
│   Node-RED（Port 1880，僅內部）                                       │
│     ├── InfluxDB 查詢流程                                             │
│     ├── 資料格式轉換                                                  │
│     └── HTTP Endpoint（僅允許 localhost:3001 呼叫）                   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
         │ Private Subnet（AWS VPC）
         │ MySQL: Port 3306（僅 EC2-1 SG 允許）
         │ InfluxDB: Port 8086（僅 EC2-1 SG 允許）
         ▼
┌─────────────────────────────── EC2-2 ───────────────────────────────┐
│   MySQL 8.0（Port 3306）                                             │
│   InfluxDB 1.8（Port 8086）                                          │
│   設備資料採集端（IoT/通訊模組直接寫入 InfluxDB）                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## AWS EC2 部署架構

### 網路配置

| 資源 | 配置 |
|------|------|
| VPC | 單一 VPC，包含 Public Subnet（EC2-1）與 Private Subnet（EC2-2）|
| EC2-1 Security Group | Inbound: 80/443（0.0.0.0/0）；Outbound: 3306/8086 → EC2-2 SG |
| EC2-2 Security Group | Inbound: 3306/8086（來源：EC2-1 Security Group ID）；無 Public IP |
| Node-RED | 僅 localhost 可存取（127.0.0.1:1880），不對外暴露 |

### 服務分工

| 服務 | 主機 | 說明 |
|------|------|------|
| Nginx | EC2-1 | 靜態前端服務 + API 反向代理 |
| Node.js Express | EC2-1 | 後端 REST API（PM2 守護） |
| Node-RED | EC2-1 | InfluxDB 串接層（僅內部） |
| MySQL 8.0 | EC2-2 | 業務資料庫 |
| InfluxDB 1.8 | EC2-2 | 時序資料庫 |

---

## 前後端分工

### 前端責任（React）

| 功能 | 說明 |
|------|------|
| 頁面路由 | React Router v6；根據角色控制路由存取 |
| 資料請求 | React Query；60 秒自動刷新；錯誤降級顯示 |
| 角色管理 | `RoleContext`；localStorage 持久化；`X-Role` Header 注入 |
| 缺欄位顯示 | `value ?? '--'`；趨勢圖斷線處理 |
| 月報列印 | `window.print()` + `@media print` CSS |
| 狀態指示 | `degraded` 旗標偵測；顯示「資料可能已過時」提示；`/api/v1/system/health` 輪詢間隔 ≤ 10 秒，回傳 `degraded` 或請求失敗時立即顯示降級提示 |

### 後端責任（Node.js Express）

| 功能 | 說明 |
|------|------|
| REST API | 完整 CRUD for 設備、告警、風險、月報、場域 |
| MySQL 存取 | Sequelize ORM |
| InfluxDB 存取 | 透過 Node-RED HTTP Endpoint |
| Mock 資料 | `mockDataService`：77 台 Mock 設備即時參數動態生成 |
| 告警引擎 | `node-cron` 每 5 分鐘掃描；離線/錯誤碼/門檻規則 |
| 月報產生 | `ejs` 模板渲染 HTML；聚合 MySQL + InfluxDB 資料 |
| 角色驗證 | `roleGuard` 中間件讀取 `X-Role` Header |
| 系統健康度 | `/api/v1/system/health` 回報 MySQL/InfluxDB/Node-RED 狀態 |

---

## Node.js REST API 與 Node-RED 責任邊界

```
Node.js 後端（業務層）           Node-RED（串接層）
─────────────────────            ─────────────────────
接收前端請求                      接收 Node.js 的內部 HTTP 請求
業務邏輯處理                      呼叫 InfluxDB 1.8 HTTP API
MySQL CRUD                       InfluxQL 查詢執行
告警規則評定                      原始資料格式轉換（→ JSON Array）
月報彙整                         回傳標準化資料給 Node.js
Mock 資料生成                    不直接回應前端
                                 不執行業務邏輯
                                 不寫入 MySQL
```

**Node-RED 提供的內部 Endpoint**（僅 localhost 可存取）：

| Endpoint | 說明 |
|----------|------|
| `GET /influx/latest?device_id=SITE01-001` | 取得設備最新一筆量測資料 |
| `GET /influx/history?device_id=SITE01-001&field=temp_outlet&from=...&to=...` | 取得歷史時序資料 |
| `GET /influx/power-meter?device_id=SITE01-001&from=...&to=...` | 取得電錶資料 |

---

## InfluxDB / MySQL 資料分工

| 資料類型 | 儲存位置 | 原因 |
|---------|---------|------|
| 設備即時量測（溫度/壓力/電流） | InfluxDB | 時序資料，高寫入頻率 |
| 電錶時序數據 | InfluxDB | 時序資料 |
| 設備主檔（名稱/型號/裝機日期） | MySQL | 業務資料，不頻繁變動 |
| 場域資訊 | MySQL | 業務資料 |
| 風險等級指派 | MySQL | 業務資料，需要歷史追蹤 |
| 告警紀錄（完整生命週期） | MySQL | 業務資料，需要複雜查詢 |
| 保養紀錄 | MySQL | 業務資料 |
| 月報紀錄（含 HTML） | MySQL | 業務資料，不需時序特性 |
| 設備目前狀態（`current_status`） | MySQL（`heat_pumps` 欄位） | 由後端排程更新，前端快速讀取 |
| 設備狀態快照（每 5 分鐘） | MySQL `status_snapshots` 或 InfluxDB | 月報可用率歷史依據 |

---

## MySQL 初步資料表設計

詳見 [data-model.md](./data-model.md) — 包含完整 DDL、索引策略、關聯說明。

**資料表清單**：
1. `sites`（客戶場域）
2. `heat_pumps`（設備主檔，含 `current_status` 快取欄位）
3. `risk_assignments`（風險等級歷史記錄）
4. `alerts`（告警完整生命週期）
5. `maintenance_records`（保養紀錄）
6. `monthly_reports`（月報記錄含 HTML）
7. `status_snapshots`（每 5 分鐘設備狀態快照，用於月報可用率計算）

---

## InfluxDB Measurement 建議

詳見 [data-model.md](./data-model.md) — 包含完整 tag/field 設計與 CQ 語句。

| Measurement | 說明 |
|-------------|------|
| `heatpump_status`（rp_raw） | 每 5 分鐘原始資料，保留 365 天 |
| `heatpump_status_1h`（rp_agg） | 每小時彙總，永久保存 |
| `heatpump_status_1d`（rp_agg） | 每日彙總，永久保存 |
| `power_meter`（rp_raw） | 電錶原始資料，保留 365 天 |
| `system_health`（可選） | 系統健康度彙總，後端排程寫入 |

---

## REST API 初步設計

詳見 [contracts/rest-api.md](./contracts/rest-api.md) — 完整 Endpoint、請求/回傳格式、角色限制。

**端點總覽**：

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/api/v1/sites` | 場域清單 |
| GET | `/api/v1/devices` | 設備清單（含狀態/即時資料） |
| GET | `/api/v1/devices/:id` | 設備詳情 |
| GET | `/api/v1/devices/:id/history` | 設備歷史時序（InfluxDB） |
| GET | `/api/v1/risks` | 風險排序清單 |
| POST | `/api/v1/risks` | 指派/更新風險等級（operator 限定） |
| GET | `/api/v1/alerts` | 告警清單（可篩選） |
| POST | `/api/v1/alerts` | 手動建立告警（operator 限定） |
| PATCH | `/api/v1/alerts/:id/acknowledge` | 確認告警（operator 限定） |
| PATCH | `/api/v1/alerts/:id/resolve` | 解決告警（operator 限定） |
| POST | `/api/v1/reports/monthly` | 產生月報（manager 限定） |
| GET | `/api/v1/reports/monthly` | 月報清單（manager 限定） |
| GET | `/api/v1/reports/monthly/:id` | 月報詳情（manager 限定） |
| GET | `/api/v1/dashboard/summary` | 老闆決策頁彙整（manager 限定） |
| GET | `/api/v1/system/health` | 系統健康度 |

---

## 前端頁面與 API 對應表

| 頁面 | 主要呼叫的 API | 刷新策略 |
|------|-------------|---------|
| 設備總覽 | `GET /devices`、`GET /sites` | 60 秒自動刷新 |
| 風險排序 | `GET /risks` | 60 秒自動刷新 |
| 單機履歷 | `GET /devices/:id`、`GET /devices/:id/history` | 手動刷新（時序圖） |
| 告警中心 | `GET /alerts`、`PATCH /alerts/:id/acknowledge`、`PATCH /alerts/:id/resolve` | 60 秒自動刷新 |
| 月報雛形 | `POST /reports/monthly`、`GET /reports/monthly/:id` | 手動觸發 |
| 老闆決策頁 | `GET /dashboard/summary`、`GET /sites` | 60 秒自動刷新 |

---

## 角色權限與 v1 Demo 權限處理方式

### v1 實作方式

```
前端 RoleContext
  ├── 儲存：localStorage['heatpump_role'] = 'operator' | 'manager'
  ├── 路由守衛：manager 頁面（月報、決策頁）在 operator 角色時顯示「無存取權限」
  ├── UI 控制：operator 角色顯示操作按鈕；manager 角色隱藏寫入操作
  └── HTTP Header：所有 API 請求附加 X-Role: {role}

後端 roleGuard 中間件
  ├── 讀取 X-Role Header
  ├── 若角色不符合 Endpoint 要求 → 回傳 403
  └── 若 Header 缺失 → 預設為 operator（v1 行為）
```

### v2 預留設計

- `AuthContext` 介面已預留 `user.id`、`user.role`、`user.token` 欄位
- `roleGuard` 中間件設計為可替換（v2 替換為 JWT 驗證）
- MySQL 尚未建立 `users` 資料表，但 `assigned_by` / `resolved_by` 等欄位已預留外鍵擴充空間

---

## 告警 v1 / v2 分層設計

### v1 必須實作

| 告警類型 | 觸發條件 | 觸發方式 |
|---------|---------|---------|
| 離線告警 | 超過 5 分鐘無資料 | node-cron 每 5 分鐘掃描 |
| 錯誤碼告警 | `error_code != 0` | node-cron 每 5 分鐘掃描 |
| 門檻超限告警 | 固定門檻（程式碼內定義） | node-cron 每 5 分鐘掃描 |
| 手動告警 | 維運人員透過 API 建立 | `POST /api/v1/alerts` |

**v1 預設門檻值**（程式碼常數，不提供 UI 設定）：
```javascript
const THRESHOLDS = {
  temp_outlet:   { warning: 33, critical: 38 },  // °C
  pressure_high: { warning: 22, critical: 25 },  // bar
  current_a:     { warning: 18, critical: 22 },  // A
};
```

### v2 預留架構

- `threshold_configs` 資料表：可設定每台設備的獨立門檻
- `device_type_thresholds`：依設備型號設定預設門檻
- 告警規則引擎重構為獨立服務（可選用 Node-RED 觸發）
- 多指標加權風險評分演算法

---

## 模擬資料與種子資料設計

### MySQL Seed 資料

```javascript
// db/seeders/001-devices.js（使用 @faker-js/faker）
const REAL_DEVICES = [
  { device_id: 'SITE01-001', name: '泳池熱泵 A', site_id: 1, is_mock: false },
  { device_id: 'SITE01-002', name: '泳池熱泵 B', site_id: 1, is_mock: false },
  { device_id: 'SITE01-003', name: '熱水供應泵', site_id: 1, is_mock: false },
];

// 產生 77 台 Mock 設備（固定 seed 確保重現性）
faker.seed(42);
const mockDevices = Array.from({ length: 77 }, (_, i) => ({
  device_id: `SITE0${(i % 3) + 1}-${String(i + 1).padStart(3, '0')}`,  // 格式：SITE01-001
  name: `模擬熱泵 ${i + 1}`,
  site_id: (i % 3) + 1,
  is_mock: true,
}));
```

### Mock 即時資料（API 層動態生成）

```javascript
// services/mockDataService.js
function generateMockSensorData(deviceId) {
  // 使用 deviceId 作為 seed，確保同一設備每次回傳相似值
  const rng = seedRandom(deviceId);
  return {
    temp_outlet:   28 + rng() * 8,    // 28~36°C
    pressure_high: 16 + rng() * 6,    // 16~22 bar
    power_kw:      8  + rng() * 10,   // 8~18 kW
    error_code:    rng() < 0.05 ? 1 : 0,  // 5% 機率有錯誤碼
  };
}
```

**混合回傳策略**：`GET /api/v1/devices` 呼叫後端時：
1. 從 MySQL 取得全部 80 台設備主檔
2. 真實設備（3 台）→ 呼叫 Node-RED 取得 InfluxDB 資料
3. Mock 設備（77 台）→ 呼叫 `mockDataService` 動態生成
4. 合併後統一回傳

---

## 月報 HTML 預覽與瀏覽器列印另存 PDF 設計

### 產生流程

```
前端選擇場域 + 月份
    ↓
POST /api/v1/reports/monthly
    ↓
後端聚合資料：
  MySQL: alerts（告警統計）
  status_snapshots 或 InfluxDB 狀態序列（依 5 分鐘區間計算可用率）
  InfluxDB: power_meter（月用電量）
    ↓
ejs 模板渲染 HTML 字串
    ↓
儲存至 monthly_reports.summary_html
    ↓
回傳 HTML 字串至前端
    ↓
前端 <div dangerouslySetInnerHTML> 渲染預覽
    ↓
使用者點擊「列印 / 另存 PDF」→ window.print()
（⚠️ v1 不產生服務端 PDF 檔案；使用者透過瀏覽器列印/另存 PDF 完成匯出）
```

### 月報必要內容（v1）

- 場域名稱 + 報告月份
- 設備數量 + 可用率（%）
- 告警次數 + 告警類型分布（表格）
- 重大事件摘要（`critical` 告警清單）
- 本月用電量（kWh）
- 無異常時顯示：「本月無異常事件，設備運行正常」

### 列印 CSS 策略

```css
@media print {
  .no-print { display: none; }     /* 隱藏導覽列、按鈕 */
  .report-page { page-break-after: always; }
  body { font-size: 12pt; }
  @page { margin: 2cm; }
}
```

---

## 資料缺欄位處理策略

詳見 [data-model.md](./data-model.md) 第四節。

**後端**：所有欄位在 API 回傳時明確設為 `null`（不省略欄位），
並附加 `data_quality.missing_fields` 陣列。

**前端**：
- 數值顯示：`value ?? '--'`
- 趨勢圖：`null` 點不繪製，折線斷開
- 狀態降級：`degraded: true` 時顯示黃色提示框

---

## 效能與錯誤處理策略

### 查詢效能

| 情境 | 策略 |
|------|------|
| 設備總覽（80 台） | `current_status` 快取於 MySQL；不每次即時查 InfluxDB |
| 歷史趨勢圖 | 依時間範圍自動選擇原始/小時/日彙總資料 |
| 月報產生 | 後端非同步聚合；月報快取於 `monthly_reports` 表，重複請求直接回傳快取 |
| 設備詳情 | `GET /devices/:id` 只查單台，不載入其他設備資料 |

### 錯誤處理

| 情境 | 後端行為 | 前端行為 |
|------|---------|---------|
| InfluxDB 連線失敗 | 回傳 `degraded: true`，data 使用 MySQL 快取狀態 | 顯示黃色「資料可能已過時」提示 |
| MySQL 連線失敗 | 回傳 500 + 標準錯誤格式 | 顯示「系統暫時無法使用」全頁提示 |
| Node-RED 超時 | 後端設定 3 秒逾時，回傳 `degraded: true` | 同 InfluxDB 失敗 |
| 告警遺漏保護 | `node-cron` 任務失敗時寫入錯誤日誌並繼續執行 | 不直接影響前端 |

### 快取策略

- React Query `staleTime: 30000`（30 秒內不重複請求）
- `refetchInterval: 60000`（60 秒自動刷新）
- `refetchOnWindowFocus: true`（重新聚焦頁面時刷新）
- `refetchIntervalInBackground: false`（背景不刷新，節省資源）

---

## 安全與網路連線建議

### v1 安全措施

| 項目 | 措施 |
|------|------|
| 資料庫隔離 | EC2-2 無 Public IP；安全群組僅允許 EC2-1 |
| Node-RED 隔離 | 僅 localhost 可存取（127.0.0.1:1880） |
| SQL Injection | Sequelize parameterized query（不拼接字串） |
| XSS（月報 HTML） | `summary_html` 由後端模板產生（不接受使用者輸入的 HTML） |
| CORS | 僅允許 EC2-1 的 Origin（或 localhost 開發時） |
| 角色控制 | `roleGuard` 中間件驗證 `X-Role`（v1 Demo 層級） |

### OWASP Top 10 對應

| 風險 | 對應措施 |
|------|---------|
| A01 存取控制 | `roleGuard` 中間件；v2 替換為 JWT |
| A03 注入 | Sequelize ORM parameterized query；InfluxQL 由 Node-RED 處理 |
| A05 安全設定錯誤 | 資料庫不對外暴露；Node-RED 僅 localhost |
| A09 日誌不足 | 後端記錄所有 5xx 錯誤；告警引擎失敗寫入日誌 |

---

## 備份與維運預留設計

### v1 不實作（但架構預留）

**MySQL 備份建議**（v2 實作）：
```bash
# 每日凌晨 2 點備份，保留 30 天
0 2 * * * mysqldump -u root -p heatpump_prod > /backup/mysql/heatpump_$(date +%Y%m%d).sql
# 上傳至 S3
aws s3 cp /backup/mysql/heatpump_$(date +%Y%m%d).sql s3://heatpump-backup/mysql/
```

**InfluxDB 備份建議**（v2 實作）：
```bash
# 備份 heatpump_db（rp_agg 彙總資料）
influxd backup -portable -database heatpump_db /backup/influxdb/$(date +%Y%m%d)
```

**月報 HTML 保存**：已存入 `monthly_reports.summary_html`（MySQL），
隨 MySQL 備份一併保存，無需另外處理。

**EC2 維運注意事項**：
- PM2 進程守護確保後端重啟後自動恢復
- Node-RED 建議也加入 PM2 管理
- InfluxDB 磁碟空間需監控（365 天原始資料 + 彙總）
- MySQL `slow_query_log` 建議開啟，協助效能診斷

---

## 技術風險與因應方案

| 風險 | 可能性 | 影響 | 因應方案 |
|------|-------|------|---------|
| InfluxDB 1.8 連線不穩 | 中 | 高 | `degraded` 模式降級；`current_status` MySQL 快取 |
| Mock 資料與真實資料混合查詢效能 | 低 | 中 | 後端並行查詢（Promise.allSettled）；Mock 資料純記憶體生成 |
| 月報生成超過 30 秒 | 低 | 中 | 使用 InfluxDB 彙總資料（rp_agg 日彙總）而非原始資料 |
| Node-RED 流程修改影響後端 | 中 | 中 | 定義清楚的內部 HTTP 契約；Node-RED 輸出格式固定 |
| Lovable 前端結構與計畫不符 | 中 | 中 | 後端 API 設計以前端需求為主；前端路由/頁面結構可調整 |
| 告警遺漏（node-cron 失敗） | 低 | 高 | 錯誤捕捉 + 日誌；下次排程補偵測；告警唯一性檢查（避免重複） |
| EC2-2 磁碟滿（InfluxDB） | 中 | 高 | 設定 Retention Policy；監控磁碟使用率 |

---

## 開發任務拆解

### 基礎建設（必須最先完成）

1. MySQL Migration 與 Seed（場域 + 設備主檔）
2. InfluxDB Retention Policy + Continuous Query 設定
3. Node-RED InfluxDB 串接流程（內部 HTTP Endpoint）
4. Express 後端骨架（路由結構、錯誤處理、roleGuard 中間件）
5. React 前端骨架（RoleContext、React Query 設定、共用 theme）

### 核心功能（依 spec 優先級）

6. `GET /devices` API + 混合真實/Mock 資料邏輯（**P1 MVP**）
7. 設備總覽頁面（**P1 MVP**）
8. `GET /risks` + `POST /risks` API（**P2**）
9. 風險排序頁面（**P2**）
10. `GET /devices/:id` + `GET /devices/:id/history` API（**P3**）
11. 單機履歷頁面（**P3**）
12. `GET /alerts` + `PATCH /alerts/:id/acknowledge` + `PATCH /alerts/:id/resolve` API（**P4**）
13. 告警引擎（node-cron 離線/錯誤碼/門檻）（**P4**）
14. 告警中心頁面（**P4**）
15. `POST /reports/monthly` + ejs 模板（**P5**）
16. 月報雛形頁面（**P5**）
17. `GET /dashboard/summary` API（**P6**）
18. 老闆決策頁（**P6**）

### TDD 優先策略

所有使用者故事開始實作前，必須先將該故事的驗收情境轉為失敗的單元、整合或 E2E 測試；
測試任務完成並確認失敗後，才能進入服務/API/頁面實作。

### 品質保證

19. 後端單元測試（alertEngine、statusUpdater 規則、mockDataService、reportService）
20. 後端整合測試（API Endpoints）；效能測試（API P95 ≤ 500ms、月報 ≤ 30 秒、設備總覽 ≤ 3 秒）
21. 前端單元測試（utils、components）
22. E2E 測試（6 個頁面主要流程，覆蓋 80 台設備完整載入；7 台僅作人工展示樣本）
23. 無障礙測試（WCAG 2.1 AA、鍵盤操作 / a11y 覆蓋率驗證）

---

## MVP 實作順序建議

```
第 1 週：基礎建設（任務 1-5）+ 設備總覽（任務 6-7）
         → 驗收：可看到 80 台設備狀態，真實設備有 InfluxDB 資料

第 2 週：風險排序（任務 8-9）+ 單機履歷（任務 10-11）
         → 驗收：可指派風險等級、查看設備歷史趨勢圖

第 3 週：告警中心（任務 12-14）
         → 驗收：告警自動偵測、確認、解決流程完整可用

第 4 週：月報（任務 15-16）+ 老闆決策頁（任務 17-18）
         → 驗收：可產生 HTML 月報並列印為 PDF；決策頁顯示跨場域摘要

第 5 週：測試（任務 19-23）+ Bug 修正 + EC2 部署驗證
         → 驗收：全部 6 頁面通過驗收情境；80 台設備可用於 v1 展示
```

**MVP 最小可交付（第 1 週結束）**：設備總覽頁面可展示 80 台設備狀態 → 符合 spec FR-001

---

## v1 / v2 / 不在範圍 分類摘要

| 功能 | v1 必須實作 | v1 可簡化 | v2 預留 | 不在本階段 |
|------|-----------|---------|--------|----------|
| 設備總覽 | ✅ | | | |
| 風險排序（手動指派） | ✅ | | | |
| 風險排序（自動評分） | | | ✅ | |
| 單機履歷 | ✅ | | | |
| 告警中心 | ✅ | | | |
| 告警門檻設定 UI | | | ✅ | |
| 月報（HTML 預覽 + 瀏覽器列印） | ✅ | | | |
| 月報（正式 PDF 生成） | | | ✅ | |
| 老闆決策頁 | ✅ | | | |
| 正式登入 / JWT | | | ✅ | |
| 手機/平板支援 | | | | ✅ 不在 v1 |
| 完整自動備份 | | | ✅ | |
| Excel 匯出 | | | ✅ | |
| 第 4 個以上場域 | | ✅（架構已支援） | | |
