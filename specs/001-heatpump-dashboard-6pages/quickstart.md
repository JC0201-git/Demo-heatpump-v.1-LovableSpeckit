# 開發快速起步指南

**所屬功能分支**：`001-heatpump-dashboard-6pages`
**建立日期**：2026-05-23

---

## 一、系統需求

| 工具 | 最低版本 | 用途 |
|------|---------|------|
| Node.js | 18 LTS | 前後端執行環境 |
| npm | 9+ | 套件管理 |
| MySQL | 8.0 | 業務資料庫 |
| InfluxDB | 1.8 | 時序資料庫 |
| Node-RED | 3.x | 資料串接層 |

---

## 二、專案目錄結構

```text
（專案根目錄）
├── frontend/                  # React 前端（Lovable 產出基礎）
│   ├── src/
│   │   ├── components/        # 共用 UI 元件
│   │   ├── pages/             # 6 個頁面元件
│   │   │   ├── DeviceOverview/
│   │   │   ├── RiskRanking/
│   │   │   ├── DeviceHistory/
│   │   │   ├── AlertCenter/
│   │   │   ├── MonthlyReport/
│   │   │   └── ExecutiveDashboard/
│   │   ├── services/          # API 請求層（React Query hooks）
│   │   ├── contexts/          # RoleContext 角色管理
│   │   ├── theme/             # 設計 token（顏色、字型、間距）
│   │   └── utils/             # 工具函數（缺欄位處理、日期格式等）
│   ├── tests/
│   └── package.json
│
├── backend/                   # Node.js Express API 後端
│   ├── src/
│   │   ├── api/               # Express 路由
│   │   │   ├── sites.js
│   │   │   ├── devices.js
│   │   │   ├── risks.js
│   │   │   ├── alerts.js
│   │   │   ├── reports.js
│   │   │   └── dashboard.js
│   │   ├── models/            # Sequelize 資料模型（MySQL）
│   │   ├── services/          # 業務邏輯層
│   │   │   ├── deviceService.js
│   │   │   ├── alertEngine.js       # 告警規則引擎
│   │   │   ├── reportService.js     # 月報產生服務
│   │   │   ├── influxService.js     # InfluxDB 資料存取（透過 Node-RED）
│   │   │   └── mockDataService.js   # Mock 資料產生
│   │   ├── middleware/
│   │   │   ├── roleGuard.js         # 角色權限中間件
│   │   │   └── errorHandler.js
│   │   ├── jobs/              # node-cron 排程任務
│   │   │   └── statusUpdater.js     # 每 5 分鐘更新設備狀態
│   │   ├── templates/         # ejs 月報模板
│   │   │   └── monthly-report.ejs
│   │   └── app.js
│   ├── db/
│   │   ├── migrations/        # Sequelize Migration 檔案
│   │   └── seeders/           # Seed 資料（80 台設備）
│   ├── tests/
│   └── package.json
│
├── node-red/                  # Node-RED Flow 設定
│   └── flows.json
│
└── specs/
    └── 001-heatpump-dashboard-6pages/
        ├── plan.md
        ├── research.md
        ├── data-model.md
        ├── quickstart.md
        ├── contracts/
        │   └── rest-api.md
        └── tasks.md            # 由 /speckit.tasks 產生
```

---

## 三、本機開發環境設定

### 3.1 克隆專案

```bash
git clone <repository-url>
cd Demo-heatpump-v.1-LovableSpeckit
git checkout 001-heatpump-dashboard-6pages
```

### 3.2 安裝後端依賴

```bash
cd backend
npm install
```

主要套件：
```json
{
  "express": "^4.18.0",
  "sequelize": "^6.37.0",
  "mysql2": "^3.9.0",
  "node-influx": "^5.9.3",
  "node-cron": "^3.0.3",
  "ejs": "^3.1.10",
  "@faker-js/faker": "^8.4.0",
  "axios": "^1.7.0",
  "dotenv": "^16.4.0",
  "cors": "^2.8.5"
}
```

### 3.3 安裝前端依賴

```bash
cd frontend
npm install
```

主要套件：
```json
{
  "@tanstack/react-query": "^5.40.0",
  "react-router-dom": "^6.23.0",
  "recharts": "^2.12.0",
  "dayjs": "^1.11.11"
}
```

### 3.4 設定環境變數

```bash
cd backend
cp .env.example .env
```

`.env` 範例（本機開發）：
```dotenv
# 伺服器
PORT=3001
NODE_ENV=development

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=heatpump_dev
DB_USER=root
DB_PASS=your_password

# InfluxDB（透過 Node-RED 代理）
NODERED_BASE_URL=http://localhost:1880
INFLUXDB_HOST=localhost
INFLUXDB_PORT=8086
INFLUXDB_DATABASE=heatpump_db

# 告警排程
ALERT_CHECK_INTERVAL_MINUTES=5
DEVICE_OFFLINE_THRESHOLD_MINUTES=5
```

---

## 四、資料庫初始化

### 4.1 建立 MySQL 資料庫

```bash
mysql -u root -p -e "CREATE DATABASE heatpump_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 4.2 執行 Migration

```bash
cd backend
npx sequelize-cli db:migrate
```

### 4.3 執行 Seed（建立 3 個場域 + 80 台設備）

```bash
npx sequelize-cli db:seed:all
```

Seed 執行後：
- 3 個場域（拉拉手游泳學院、洗衣廠、罐頭工廠）
- 3 台真實設備（`is_mock = 0`）
- 77 台 Mock 設備（`is_mock = 1`）

### 4.4 建立 InfluxDB Retention Policy

```bash
influx -execute "
CREATE DATABASE heatpump_db;
CREATE RETENTION POLICY rp_raw ON heatpump_db DURATION 365d REPLICATION 1 DEFAULT;
CREATE RETENTION POLICY rp_agg ON heatpump_db DURATION INF REPLICATION 1;
"
```

---

## 五、啟動開發環境

### 5.1 啟動後端 API

```bash
cd backend
npm run dev
# 後端執行於 http://localhost:3001
```

### 5.2 啟動前端

```bash
cd frontend
npm run dev
# 前端執行於 http://localhost:5173
```

### 5.3 啟動 Node-RED（若需要 InfluxDB 真實資料）

```bash
node-red -p 1880
# Node-RED 執行於 http://localhost:1880
```

---

## 六、常用開發指令

### 後端

```bash
# 執行測試
npm test

# 執行測試（含覆蓋率）
npm run test:coverage

# 程式碼檢查
npm run lint

# 重置並重新 Seed 資料庫
npx sequelize-cli db:migrate:undo:all && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all

# 新增 Migration
npx sequelize-cli migration:generate --name add-some-field
```

### 前端

```bash
# 執行測試
npm test

# 程式碼檢查
npm run lint

# 打包正式版本
npm run build
```

---

## 七、API 測試快速驗證

```bash
# 取得場域清單
curl http://localhost:3001/api/v1/sites

# 取得設備清單（維運人員角色）
curl -H "X-Role: operator" http://localhost:3001/api/v1/devices

# 取得告警清單（只看未處理）
curl -H "X-Role: operator" "http://localhost:3001/api/v1/alerts?status=open"

# 取得老闆決策頁資料（高層管理者角色）
curl -H "X-Role: manager" http://localhost:3001/api/v1/dashboard/summary

# 確認告警（ID=1）
curl -X PATCH -H "X-Role: operator" -H "Content-Type: application/json" \
  -d '{"acknowledged_by":"維運人員"}' \
  http://localhost:3001/api/v1/alerts/1/acknowledge
```

---

## 八、AWS EC2 部署步驟概覽

### EC2-1（Dashboard App Server）

```bash
# 安裝 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 建立應用目錄
sudo mkdir -p /opt/heatpump-dashboard
sudo chown ubuntu:ubuntu /opt/heatpump-dashboard

# 上傳並安裝
scp -r backend/ ubuntu@<EC2-1-IP>:/opt/heatpump-dashboard/
cd /opt/heatpump-dashboard/backend && npm install --production

# 設定 PM2（進程守護）
npm install -g pm2
pm2 start src/app.js --name heatpump-backend
pm2 startup && pm2 save

# 設定 Nginx（靜態前端 + API 代理）
sudo apt-get install -y nginx
# 將 frontend/dist 複製至 /var/www/heatpump/
# 設定 /api 路由代理至 localhost:3001
```

### EC2-2（Database Server）

- MySQL 8.0 + InfluxDB 1.8 安裝於 EC2-2
- 安全群組：僅允許 EC2-1 的 Private IP 存取 Port 3306 和 Port 8086
- EC2-1 的 `.env` 中 `DB_HOST` 設為 EC2-2 的 **Private IP**（不使用 Public IP）

---

## 九、開發注意事項

1. **Mock 資料**：77 台 Mock 設備的即時資料由後端 `mockDataService.js` 動態產生，
   不從 InfluxDB 讀取。真實設備（3 台）透過 Node-RED 從 InfluxDB 取得資料。

2. **缺欄位**：所有 API 回傳欄位若無資料，回傳 `null` 而非省略欄位。
   前端一律用 `value ?? '--'` 顯示。

3. **角色切換**：前端 `RoleContext` 提供 `switchRole('operator' | 'manager')` 方法，
   預設角色為 `operator`。

4. **自動刷新**：React Query 設定 `refetchInterval: 60000`（60 秒），
   視窗失焦時暫停（`refetchIntervalInBackground: false`）。

5. **月報列印**：月報頁面的「匯出 PDF」按鈕呼叫 `window.print()`，
   確保 `@media print` CSS 樣式正確設定（隱藏導覽列、設定頁面邊距）。

---

## 十、前後端整合：設定說明

### 10.1 前端環境變數（`frontend/.env.local`）

```dotenv
# 後端 API 基礎路徑（本機開發）
VITE_API_BASE_URL=http://localhost:3001/api/v1

# 預設角色（operator 或 manager）
VITE_DEFAULT_ROLE=operator
```

正式部署時（Cloudflare Workers），`VITE_API_BASE_URL` 改為後端的正式域名。

### 10.2 前端 API 客戶端設定（`frontend/src/lib/api/client.ts`）

前端的 API 客戶端需自動注入 `X-Role` header：

```typescript
// frontend/src/lib/api/client.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  role: 'operator' | 'manager'
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Role': role,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}
```

### 10.3 型別對齊（Mock → API）

整合前需完成以下型別對齊（詳見 `frontend-integration-notes.md` 第四節）：

| 現有 Mock 型別 | 對齊後 API 型別 | 修改說明 |
|---------------|----------------|---------|
| `DeviceStatus: "abnormal"` | `DeviceStatus: "fault"` | `abnormal` 改為 `fault` |
| `DeviceStatus: "maintenance"` | 移除 | 規格未定義此狀態 |
| 新增 `"warning"` | `DeviceStatus: "warning"` | 原 Mock 缺少此狀態 |
| `riskScore: number (0–100)` | `risk_level: "high" \| "medium" \| "low"` | 數值評分改為等級字串 |
| `isRealApi: boolean` | `is_mock: boolean` | 語意相反；整合時統一使用 `is_mock` |
| `AlertStatus: "in_progress"` | `AlertStatus: "acknowledged"` | 對齊後端告警生命週期 |
| `rankChange: "up" \| "down" \| "flat"` | 移除 | v1 後端不提供；前端移除此欄位 |

### 10.4 CORS 設定（後端）

本機開發時，後端需允許前端開發伺服器的 CORS 請求：

```typescript
// backend/src/app.ts
import cors from 'cors';

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-production-domain.com']
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'X-Role'],
}));
```

### 10.5 降級狀態處理（前端）

當後端回應包含 `degraded: true` 時，前端應在頁面頂端顯示降級 Banner：

```typescript
// 每個 TanStack Query hook 取得資料後檢查
if (data?.degraded) {
  // 顯示共用 DegradedBanner 元件
  // 顯示 data.last_good_data_at 時間戳記
  // 繼續顯示 data.data 中的最後已知資料
}
```

系統健康度輪詢（`/api/v1/system/health`，每 10 秒）：

```typescript
useQuery({
  queryKey: ['system-health'],
  queryFn: () => fetch('/api/v1/system/health').then(r => r.json()),
  refetchInterval: 10_000,
  refetchIntervalInBackground: false,
});
```

### 10.6 API 契約唯一來源

**所有 API 端點定義以 `specs/001-heatpump-dashboard-6pages/contracts/openapi.yaml` 為準。**

- 後端路由必須完全符合 openapi.yaml 中的 operationId、參數名稱與回應 schema
- 前端型別定義（`frontend/src/lib/api/types.ts`）必須由 openapi.yaml 的 schemas 生成或手動對齊
- `rest-api.md` 僅供人類閱讀參考，有衝突時以 openapi.yaml 為準
