# 技術研究報告：熱泵設備監控儀表板

**所屬功能分支**：`001-heatpump-dashboard-6pages`
**研究日期**：2026-05-23
**階段**：Phase 0 — 技術選型決策

---

## 研究摘要

本研究針對 Plan 階段 Technical Context 中的所有 NEEDS CLARIFICATION 項目進行調查，
並對每個關鍵技術決策提出選型結果、理由與替代方案分析。

---

## 決策 1：後端框架選型

- **決策**：採用 Node.js + **Express.js** 作為後端 REST API 框架
- **理由**：
  - Express 是 Node.js 生態最成熟的 Web 框架，社群龐大、文件完整
  - 對 InfluxDB 1.8 HTTP API 與 MySQL 的第三方套件支援充足
  - 適合本專案規模（80 台設備、6 頁面、內部工具），無需 Fastify 等高效能框架的額外複雜度
  - 與 Node-RED 同樣運行於 Node.js 環境，維運一致性高
- **替代方案考慮**：
  - Fastify：效能更高，但本專案負載不需要此層級；學習曲線略高
  - NestJS：架構清晰但對 v1 內部工具過度設計
- **v1 必須實作**：Express + REST API

---

## 決策 2：前端資料請求策略

- **決策**：採用 **React Query（TanStack Query v5）** 作為前端資料請求與快取管理層
- **理由**：
  - 內建自動刷新（refetchInterval）直接支援 60 秒輪詢需求
  - 提供 stale-while-revalidate 語義，資料源中斷時自動顯示最後已知狀態
  - 優雅的 `isLoading` / `isError` / `data` 狀態管理，符合 spec 中的降級顯示需求
  - 與 Lovable 產出的 React 專案高度相容
- **替代方案考慮**：
  - SWR：功能相近但生態略小，文件較少
  - 原生 `useEffect + fetch`：需自行管理快取與輪詢邏輯，增加維護成本
- **v1 必須實作**：React Query 輪詢 + 錯誤邊界降級顯示

---

## 決策 3：InfluxDB 1.8 存取策略

- **決策**：後端透過 **`node-influx`** 套件（或直接呼叫 InfluxDB 1.8 HTTP API）存取資料；
  Node-RED 作為中間資料串接層，提供內部 HTTP Endpoint 給 Node.js 後端
- **理由**：
  - InfluxDB 1.8 使用 InfluxQL，`node-influx` 套件直接支援
  - Node-RED 已在環境中部署，可利用現有 InfluxDB 節點（`node-red-contrib-influxdb`）
    避免重複建立連線管理邏輯
  - Node-RED → Node.js 後端的內部呼叫可用 HTTP + JSON，介面清晰
- **替代方案考慮**：
  - 後端直接呼叫 InfluxDB HTTP API（跳過 Node-RED）：可行，但放棄已有的 Node-RED 設定
  - WebSocket 推播：v1 不需要即時推播，60 秒輪詢已足夠
- **v1 必須實作**：Node-RED HTTP endpoint → Node.js 後端 → 前端

---

## 決策 4：InfluxDB 1.8 Retention Policy 與 Downsampling

- **決策**：
  - 原始資料 Retention Policy：`rp_raw`，保留 **365 天**（`DURATION 365d`）
  - 彙總資料 Retention Policy：`rp_agg`，保留 **無限期**（`DURATION INF`）
  - Downsampling 策略：使用 **Continuous Query（CQ）** 每小時彙總為 1 小時平均值，
    每天彙總為日統計（最大、最小、平均、累積）
- **理由**：
  - 設備採集週期 5 分鐘 → 1 年原始資料 = 約 105,000 筆/設備/欄位
  - 月報查詢月度統計不需要 5 分鐘解析度，日彙總資料已足夠
  - Continuous Query 是 InfluxDB 1.8 原生功能，無需外部排程
- **替代方案考慮**：
  - 手動排程（cron + Node.js script）：較繁瑣，維護成本高
  - 全部保留原始資料：查詢效能下降，月報生成可能超過 30 秒
- **v1 必須實作**：rp_raw（365d）+ rp_agg（INF）+ 2 個 Continuous Query

---

## 決策 5：MySQL ORM 選型

- **決策**：採用 **Sequelize v6** 作為 MySQL ORM
- **理由**：
  - 支援 MySQL，提供 Migration 機制（`sequelize-cli`）
  - 強型別的 Model 定義降低欄位錯誤風險
  - 社群成熟，與 Express 整合文件充足
  - v2 若需升級至 TypeORM 或 Prisma，資料表設計可直接沿用
- **替代方案考慮**：
  - Prisma：型別安全更佳，但對 v1 內部工具過度設計
  - 裸 SQL（`mysql2`）：效能最高，但維護成本高，Migration 需自行管理
- **v1 必須實作**：Sequelize + Migration + Seed

---

## 決策 6：Mock Data 產生策略

- **決策**：後端使用 **`@faker-js/faker`** 撰寫 Seed Script，在 MySQL 中建立 77 台
  虛擬設備主檔，並在 API 回傳時從 `mock_data` 邏輯生成即時參數
- **理由**：
  - 77 台 Mock 設備需要在 `HeatPump` 主檔中有對應紀錄（MySQL），以支援風險指派、
    告警管理等功能
  - Mock 即時資料（溫度、壓力等）在 API 層動態生成（而非寫入 InfluxDB），
    降低測試資料管理複雜度
  - `@faker-js/faker` 可產生具有一致性的隨機資料（固定 seed 值確保重現性）
- **替代方案考慮**：
  - 將 77 台 Mock 資料全部寫入 InfluxDB：維護成本高，不易重置
  - 前端自行產生 Mock 資料：違反 spec 要求（後端統一產生）
- **v1 必須實作**：Seed Script + API 層 Mock 資料動態生成

---

## 決策 7：月報 HTML 設計與列印策略

- **決策**：後端產生 **HTML 字串**（透過 `ejs` 或 `handlebars` 模板引擎），
  前端以 `window.print()` 或 `<iframe>` 列印預覽實現 PDF 匯出
- **理由**：
  - v1 不需要正式 PDF 生成（避免 `puppeteer` 或 `wkhtmltopdf` 的部署複雜度）
  - 瀏覽器原生列印支援 CSS `@media print`，可控制頁眉、頁尾、分頁
  - `ejs` 是 Node.js 生態輕量模板引擎，無需額外學習成本
  - spec 明確允許「使用瀏覽器列印或另存 PDF」
- **替代方案考慮**：
  - Puppeteer 後端生成 PDF：環境安裝複雜（Chrome headless），v1 不值得
  - React-to-PDF 前端方案：版面控制有限，難以符合多頁月報需求
- **v1 必須實作**：`ejs` 模板 + `window.print()` CSS 媒體列印
- **v2 預留**：後端 Puppeteer 或 WeasyPrint 正式 PDF 生成

---

## 決策 8：AWS EC2 安全群組配置

- **決策**：
  - EC2-1（Dashboard App Server）：開放 Port 80/443（公開），Port 3000/8080（內部 API，可選擇 Nginx 代理）
  - EC2-2（Database Server）：僅開放 EC2-1 的 Private IP 存取 Port 8086（InfluxDB）與 Port 3306（MySQL）
  - EC2-1 與 EC2-2 同屬一個 **VPC**，透過 Private Subnet 通訊
- **理由**：
  - VPC Private Subnet 確保資料庫服務不暴露於公網
  - Security Group 白名單（僅允許 EC2-1 的安全群組）比 IP 白名單更易維護
  - v1 為內部工具，EC2-1 可設定 HTTPS 或 HTTP，視部署條件而定
- **替代方案考慮**：
  - SSH Tunnel：可行但增加維運複雜度
  - RDS（代替自建 MySQL）：成本較高，v1 內部工具不需要
- **v1 必須實作**：VPC + 安全群組白名單

---

## 決策 9：前端 Role 切換（v1 Demo 角色系統）

- **決策**：前端使用 **React Context + localStorage** 儲存當前角色，
  提供角色切換 UI（下拉選單或按鈕），不需要任何後端驗證
- **理由**：
  - v1 為內部工具 Demo，角色切換僅用於展示，不是安全機制
  - Context + localStorage 實作簡單，5 分鐘可完成
  - 架構上已隔離角色邏輯（`AuthContext`），v2 可直接替換為 JWT 驗證
- **替代方案考慮**：
  - 後端 Session：v1 不需要，增加不必要複雜度
  - 多個 URL（如 `/admin`）：使用者體驗差，難以 Demo
- **v1 必須實作**：前端 `RoleContext` + localStorage
- **v2 預留**：後端 JWT 認證 + RBAC

---

## 決策 10：告警引擎設計

- **決策**：v1 採用 **Node.js 後端排程（`node-cron`）** 每 5 分鐘掃描一次設備狀態，
  偵測離線與錯誤碼，寫入 `alerts` 表
- **理由**：
  - v1 告警規則簡單（離線、錯誤碼、固定門檻），不需要複雜規則引擎
  - `node-cron` 輕量，與 Express 後端在同一進程，維運簡單
  - v2 可替換為獨立告警微服務或整合 Node-RED 推播
- **替代方案考慮**：
  - Node-RED 直接生成告警：Node-RED 不應直接寫入業務資料庫（責任邊界）
  - 前端偵測：不可靠，且前端可能關閉
- **v1 必須實作**：`node-cron` 排程 + 告警規則引擎（離線/錯誤碼/門檻）
- **v2 預留**：可設定門檻、多指標加權評分
