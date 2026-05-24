# 開發快速起步指南

**所屬功能分支**：`001-heatpump-dashboard-6pages`

---

## 文件拆分

- [quickstart-local.md](./quickstart-local.md)：系統需求、本機安裝、環境變數、資料庫初始化、啟動服務
- [quickstart-ops.md](./quickstart-ops.md)：常用指令、API 快速驗證、EC2 部署概覽、開發注意事項

---

## 快速流程

1. 安裝 Node.js 18 LTS、MySQL 8.0、InfluxDB 1.8、Node-RED。
2. 依 [quickstart-local.md](./quickstart-local.md) 安裝前後端依賴並建立 `.env`。
3. 執行 MySQL migration、seed 與 InfluxDB 初始化。
4. 啟動後端、前端與 Node-RED。
5. 依 [quickstart-ops.md](./quickstart-ops.md) 進行 API 快速驗證與完整驗收。

---

## 驗收入口

本功能完整驗收需確認：

- 設備總覽、風險排序、老闆決策頁能顯示 80 台設備與 3 個場域。
- 新增第 4 場域後，設備總覽、風險排序、月報選單與老闆決策頁自動顯示。
- 斷開 InfluxDB 或 Node-RED 後，前端 10 秒內顯示「資料可能已過時」。
- 月報可由 manager 產生 HTML 預覽並透過 `window.print()` 列印。
- CI 的 lint、test、Lighthouse、bundle budget、a11y 與 visual regression 全部通過。
