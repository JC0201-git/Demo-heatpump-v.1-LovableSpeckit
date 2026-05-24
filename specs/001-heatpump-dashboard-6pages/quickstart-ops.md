# 開發指令、驗證與部署

**所屬文件**：[quickstart.md](./quickstart.md)

---

## 常用指令

後端：

```bash
cd backend
npm test
npm run test:coverage
npm run lint
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

前端：

```bash
cd frontend
npm test
npm run lint
npm run build
npx playwright test
```

## API 快速驗證

```bash
# 場域清單
curl -H "X-Role: operator" http://localhost:3001/api/v1/sites

# 設備清單，依 site_code 篩選
curl -H "X-Role: operator" "http://localhost:3001/api/v1/devices?site_code=SITE01"

# 告警清單，依 site_code 與狀態篩選
curl -H "X-Role: operator" "http://localhost:3001/api/v1/alerts?site_code=SITE01&status=open"

# 老闆決策頁
curl -H "X-Role: manager" http://localhost:3001/api/v1/dashboard/summary

# 確認告警
curl -X PATCH -H "X-Role: operator" -H "Content-Type: application/json" \
  http://localhost:3001/api/v1/alerts/1/acknowledge
```

## EC2 部署概覽

EC2-1（Dashboard App Server）：

- 安裝 Node.js 18、Nginx、PM2、Node-RED。
- 建立 `/var/www/heatpump` 放置 `frontend/dist`。
- Express 以 PM2 守護，預設 port 3001。
- Nginx `/` 指向 React 靜態檔案，`/api` 反向代理到 `localhost:3001`。
- Node-RED 僅允許 localhost 存取。

EC2-2（Database Server）：

- 安裝 MySQL 8.0 與 InfluxDB 1.8。
- 無公網 IP。
- 安全群組僅允許 EC2-1 存取 3306 與 8086。
- EC2-1 `.env` 的 DB/Influx host 使用 EC2-2 private IP。

## 開發注意事項

1. 77 台 mock 設備由 `mockDataService.js` 動態產生，不讀 InfluxDB。
2. 真實設備透過 Node-RED 從 InfluxDB 取得資料。
3. 所有 API 回傳欄位若無資料，回傳 `null` 而非省略。
4. 前端以 `value ?? '--'` 呈現缺欄位。
5. React Query 預設 60 秒刷新，背景不刷新。
6. 角色切換使用 `RoleContext`，所有 API 注入 `X-Role`。
7. 月報列印使用 `window.print()`，列印樣式需隱藏導覽與操作按鈕。
8. 每次共享元件調整後需跑 6 頁 screenshot/visual regression。
