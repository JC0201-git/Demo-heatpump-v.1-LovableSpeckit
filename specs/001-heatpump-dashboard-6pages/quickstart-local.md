# 本機開發快速起步

**所屬文件**：[quickstart.md](./quickstart.md)

---

## 系統需求

- Node.js 18 LTS
- npm 9+
- MySQL 8.0
- InfluxDB 1.8
- Node-RED
- Git

## 專案結構

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
specs/001-heatpump-dashboard-6pages/
```

## 安裝依賴

```bash
cd backend
npm ci

cd ../frontend
npm ci
```

所有依賴必須使用精確版本，正式與開發依賴不得使用 `^`、`~`、`x` 或 `*`。

## 後端環境變數

建立 `backend/.env`：

```bash
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=heatpump_dashboard
DB_USER=root
DB_PASS=password

INFLUXDB_HOST=localhost
INFLUXDB_PORT=8086
INFLUXDB_DATABASE=heatpump_db
NODERED_BASE_URL=http://localhost:1880

ALERT_CHECK_INTERVAL_MINUTES=5
DEVICE_OFFLINE_THRESHOLD_MINUTES=5
```

## 資料庫初始化

```bash
mysql -u root -p -e "CREATE DATABASE heatpump_dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

cd backend
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

種子資料需建立：

- `SITE01`、`SITE02`、`SITE03`
- 3 台真實設備（`is_mock = 0`）
- 77 台模擬設備（`is_mock = 1`）
- 所有設備使用 `SITExx-xxx` 格式

## InfluxDB 初始化

```bash
cd backend
bash db/influxdb-setup.sh
```

初始化腳本需建立 `rp_raw`、`rp_agg` 與 `heatpump_status` 小時/日連續查詢。

## 啟動服務

後端：

```bash
cd backend
npm run dev
```

前端：

```bash
cd frontend
npm run dev
```

Node-RED：

```bash
node-red node-red/flows.json
```

預設服務位置：

- 後端 API：`http://localhost:3001`
- 前端：`http://localhost:5173`
- Node-RED：`http://localhost:1880`
