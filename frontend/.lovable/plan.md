
# 熱泵監控儀表板 — 全前端 Prototype 實作計畫

依據 `spec.md` / `plan.md` 內容，建立一個**完全前端、無後端依賴**的可互動 Demo。所有資料以 Mock 產生（80 台設備），符合規格定義的配色、欄位、排序與互動規則。

---

## 1. 技術選型

- **框架**：React 18 + TypeScript + Vite（沿用 Lovable 預設）
- **樣式**：Tailwind CSS + shadcn/ui（自訂 design token 對齊深綠黑主題）
- **路由**：React Router（6 個頁面 + 登入）
- **圖表**：Recharts（深色背景、Tooltip、異常點標示）
- **狀態**：Zustand（裝置列表、告警、選中設備、模擬即時刷新）
- **PDF 匯出**：jsPDF + html2canvas（月報頁）
- **Icon**：lucide-react

---

## 2. 設計 Token（寫入 `index.css` + `tailwind.config.ts`）

| Token | 值 | 用途 |
|---|---|---|
| `--bg-base` | `#0d1f1a` | 主背景（深綠黑） |
| `--bg-elevated` | `#0a1814` | 側欄／卡片 |
| `--bg-surface` | `#13302a` | 區塊背景 |
| `--accent` | `#a3e635` | 主強調黃綠 |
| `--status-ok` | `#22c55e` | 正常 |
| `--status-error` | `#ef4444` | 異常／高嚴重 |
| `--status-warn` | `#f97316` | 待維修 |
| `--status-offline` | `#6b7280` | 離線 |
| `--text-primary` | `#ffffff` |  |
| `--text-secondary` | `#d9d9d9` |  |
| `--text-muted` | `#6b7280` |  |

字體：Inter / system；圓角：4px badge、8px 卡片。

---

## 3. 頁面架構

```text
/login              登入頁（純前端假驗證，任意帳密進入）
/                   → 重導 /overview
/overview           P1 設備總覽（80 台列表 + 篩選 + 搜尋）
/risk               P2 風險排序（Top 10 + 排名變動）
/device/:id         P2 單機履歷（4 子頁籤）
/alerts             P1 告警中心（指派 / 解除）
/monthly-report     P3 月報雛形（含 PDF 匯出）
/executive          P3 老闆決策頁（KPI + 產能曲線）
```

固定左側導覽列（240px / 收合 60px），頂部資訊列含「最後更新時間」與可模擬的「API 連線異常」橫幅。

---

## 4. 元件清單

**共用**
- `AppShell`（Sidebar + TopBar + Outlet）
- `StatusBadge`（normal / abnormal / offline / maintenance）
- `MetricCard`（標題 + 數值 + 單位 + 趨勢箭頭）
- `DataTable`（排序、篩選、空狀態、骨架屏）
- `LineChart` / `BarChart` / `Histogram`（Recharts 包裝、深色 theme、異常點）
- `ApiBanner`（可手動觸發顯示／隱藏）
- `EmptyState` / `Skeleton` / `Toast`

**頁面專屬**
- `DeviceListRow`、`RiskRankRow`（含 ↑↓ 變動）
- `DeviceHeader` + Tabs（用電／運轉／異常／維修）
- `AlertRow`（指派 Dialog、解除 Dialog）
- `MonthPicker`、`HealthScoreHistogram`、`ExportPdfButton`
- `CapacityCurveChart`（產能曲線 + 目前營運點）

---

## 5. Mock 資料層 `src/mocks/`

- `devices.ts`：80 台（7 真實 + 73 mock 標記），含編號、客戶、地點、狀態、安裝日、riskScore、最後心跳
- `clients.ts`：~15 個客戶
- `alerts.ts`：50+ 筆告警（多種嚴重性 / 狀態 / 指派）
- `telemetry.ts`：每台 30 天每日 kWh、運轉時數、COP、開機次數（seeded random）
- `incidents.ts` / `workOrders.ts`：異常與維修歷史
- `technicians.ts`：維運人員 + 工單數
- `systemSettings.ts`：`MAX_WORK_ORDERS_PER_TECH`、`MAX_DEVICES_PER_TECH`、`ALERT_OVERDUE_HOURS`

**模擬即時刷新**：Zustand store 每 5 秒抖動部分設備數值與心跳，並以低機率觸發新告警。

---

## 6. 頁面實作要點（對齊 FR）

- **總覽**：80 列表 + 狀態 / 客戶搜尋（前綴 LIKE 模擬，case-insensitive），點列導向 `/device/:id`
- **風險排序**：Top 10 依 riskScore 降序，顯示主因 + 建議行動（緊急／本週／本月）+ 排名變動箭頭
- **單機履歷**：頂部設備資訊，4 Tabs；用電折線圖標示異常值（圓點 +20% 飽和），未滿 30 天附「資料期間」說明
- **告警中心**：排序＝未指派 → 嚴重性 → 時間新→舊；高嚴重列紅色背景；指派 / 解除 Dialog 更新 store
- **月報**：MonthPicker → 健康分數直方圖（5 區間）+ 異常類型長條圖 + Top 5 異常設備（次數相同以 device_code ASC）；總量並列每日平均；「匯出 PDF」按鈕呼叫 html2canvas → jsPDF（A4 直式 15mm 邊距，右下角進度提示）
- **老闆決策**：3 KPI 卡 + 維運人員利用率表（`activeWO / MAX_WORK_ORDERS_PER_TECH × 100`）+ Top 5 風險客戶（依 avgRiskScore 分級）+ 產能曲線（X：0–MAX_DEVICES_PER_TECH 每 10、Y：利用率，標示目前營運點）

---

## 7. 互動與狀態

- Hover / Focus（黃綠 2px 虛框）/ Active / Disabled 全套
- 頁面切換 150ms 淡入淡出
- TopBar 模擬按鈕：「觸發 API 異常」、「重置 Mock」
- 時間範圍切換（即時 / 今日 / 7 天 / 30 天）影響趨勢圖

---

## 8. 響應式

- 桌面 ≥1280：完整側欄 + 多欄
- 平板 768–1279：側欄收合為 60px，KPI 卡 2 欄
- 手機 <768：抽屜式側欄，卡片單欄，表格水平捲動

---

## 9. 檔案結構

```text
src/
├─ pages/ (Login, Overview, Risk, DeviceDetail, Alerts, MonthlyReport, Executive)
├─ components/ (layout/, common/, charts/, device/, alert/, report/)
├─ store/ (useDeviceStore, useAlertStore, useUiStore)
├─ mocks/
├─ lib/ (format.ts, riskUtils.ts, pdfExport.ts)
└─ styles/ (index.css with tokens)
```

---

## 10. 交付驗收

- 6 個頁面 + 登入皆可瀏覽，導覽流暢
- 配色、徽章、Hover/Focus 對齊 FR-030~035
- Mock 即時刷新可見、告警可指派與解除、月報可匯出 PDF
- 桌面 / 平板 / 手機三種寬度皆可正常使用
- 全部介面文字使用繁體中文 (zh-TW)

按下「實作此計畫」後即開始建置。
