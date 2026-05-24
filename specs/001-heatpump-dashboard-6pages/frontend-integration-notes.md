# 前端整合規格說明

**所屬功能分支**：`integrate-lovable-frontend`
**建立日期**：2026-05-24
**參考規格**：[spec.md](./spec.md) | [plan.md](./plan.md) | [contracts/rest-api.md](./contracts/rest-api.md)

---

## 一、技術棧（現有 Lovable 前端）

| 項目 | 技術 |
|------|------|
| 框架 | React 19 + TypeScript |
| 路由 | TanStack Router（File-based） |
| 資料請求 | TanStack Query v5 |
| UI 元件 | Radix UI + Tailwind CSS v4 |
| 圖表 | Recharts |
| 建置工具 | Vite + TanStack Start |
| 部署目標 | Cloudflare（wrangler.jsonc） |

---

## 二、頁面路由對應

| 路由 | 頁面 | 優先級 | 可存取角色 | 寫入權限 |
|------|------|--------|-----------|----------|
| `/overview` | 設備總覽 | P1 | 維運人員、高層管理者 | — |
| `/risk` | 風險排序 | P2 | 維運人員、高層管理者 | 維運人員（風險等級指派） |
| `/device.$id` | 單機履歷 | P3 | 維運人員、高層管理者 | — |
| `/alerts` | 告警中心 | P4 | 維運人員、高層管理者 | 維運人員（確認/解決告警） |
| `/monthly-report` | 月報雛形 | P5 | 高層管理者 | — |
| `/executive` | 老闆決策頁 | P6 | 高層管理者 | — |
| `/login` | 角色切換 | — | 全部 | — |

---

## 三、現有前端目錄結構

```
frontend/src/
├── routes/              # 頁面（已全部建立）
│   ├── __root.tsx
│   ├── index.tsx        → redirect /overview
│   ├── overview.tsx     # 設備總覽
│   ├── risk.tsx         # 風險排序
│   ├── device.$id.tsx   # 單機履歷
│   ├── alerts.tsx       # 告警中心
│   ├── monthly-report.tsx
│   ├── executive.tsx
│   └── login.tsx
├── components/
│   ├── app-shell.tsx    # 共用頁面框架（含側邊導覽）
│   ├── badges.tsx
│   ├── ui-bits.tsx
│   └── ui/              # Radix UI 元件
├── lib/
│   ├── app-state.tsx    # 全域狀態（Context + mock 模擬資料定時更新）
│   ├── format.ts        # 狀態標籤／顏色／時間格式工具函數
│   ├── utils.ts
│   └── mocks/
│       ├── types.ts     # 前端型別定義
│       ├── data.ts      # 種子資料（80 台設備、告警等）
│       └── seed.ts
```

---

## 四、Mock 型別 vs 規格 API 型別對應

整合前需對齊以下差異：

| Mock 欄位 | API 欄位（rest-api.md） | 差異說明 |
|-----------|------------------------|----------|
| `DeviceStatus: "normal" \| "abnormal" \| "offline" \| "maintenance"` | `"normal" \| "warning" \| "fault" \| "offline"` | **需對齊**：`abnormal → fault`；`warning` 需新增；`maintenance` 規格未定義，需確認是否保留 |
| `riskScore: number (0–100)` | `risk_level: "high" \| "medium" \| "low"` | **需對齊**：v1 為手動指派等級，非數值評分 |
| `isRealApi: boolean` | `is_mock: boolean` | 命名相反，語意相同；整合時統一使用 `is_mock` |
| `AlertStatus: "open" \| "in_progress" \| "resolved"` | 後端定義：待確認 | 需與後端 API 對齊 |
| `rankChange: "up" \| "down" \| "flat"` | 無對應欄位 | v1 後端不提供排名變動，前端需移除或自行計算 |

---

## 五、需整合的 REST API 端點

**基礎路徑**：`/api/v1`
**角色認證**：所有請求需攜帶 `X-Role` header（`operator` / `manager`）

| HTTP 方法 | 端點 | 用途 | 使用頁面 |
|-----------|------|------|---------|
| GET | `/sites` | 場域清單 | 設備總覽、月報、老闆決策頁 |
| GET | `/devices` | 設備清單（含狀態，可依 `site_id`/`status` 篩選） | 設備總覽 |
| GET | `/devices/:device_id` | 單一設備詳情 | 單機履歷 |
| GET | `/devices/:device_id/history` | 設備歷史參數趨勢（時序） | 單機履歷 |
| GET | `/devices/:device_id/maintenance` | 保養紀錄 | 單機履歷 |
| GET | `/risks` | 風險排序清單 | 風險排序 |
| POST | `/risks` | 指派或更新風險等級 | 風險排序 |
| GET | `/alerts` | 告警清單（可依場域/設備/狀態篩選） | 告警中心、單機履歷 |
| POST | `/alerts` | 手動建立告警 | 告警中心 |
| PATCH | `/alerts/:id/acknowledge` | 確認告警 | 告警中心 |
| PATCH | `/alerts/:id/resolve` | 解決告警（含備註） | 告警中心 |
| GET | `/reports/monthly` | 月報清單 | 月報雛形 |
| POST | `/reports/monthly` | 產生或重新產生月報 | 月報雛形 |
| GET | `/reports/monthly/:id` | 取得月報詳情 | 月報雛形 |
| GET | `/dashboard/summary` | 跨場域彙整指標 | 老闆決策頁 |
| GET | `/system/health` | 系統健康度（降級偵測） | 全頁面 |

以上端點僅為前端整合摘要；若與 `contracts/openapi.yaml` 衝突，一律以 `contracts/openapi.yaml` 為準。

---

## 六、角色管理規格

### 使用者角色定義

| 角色 | spec.md 名稱 | v1 狀態 | 可存取頁面 | 寫入權限 |
|------|------------|---------|-----------|----------|
| 高層管理者 | 高層管理者 | ✅ v1 實作 | 全部 6 頁 | 唯讀（不可操作告警或指派風險）|
| 維運人員 | 維運人員 | ✅ v1 實作 | 設備總覽、風險排序、單機履歷、告警中心 | 告警確認/解決、風險等級指派 |
| 終端客戶 | —（未定義）| ⛔ v1 不實作 | — | — |

> **終端客戶說明**：spec.md 明確標註「系統架構須預留多租戶擴充介面，v1 不實作」。v1 為設備商內部員工共用後台，不設終端客戶角色、不做場域資料隔離。多租戶隔離列為 v2 規劃項目。

### 前端實作規則

- 角色儲存於 `localStorage`，key 為 `x-role`，值為 `operator`（維運人員）或 `manager`（高層管理者）
- 所有 API 請求需在 header 加入 `X-Role: <role>`
- 前端路由守衛：高層管理者若存取寫入操作（如確認告警、指派風險），需顯示「無操作權限」提示
- `/login` 頁面為角色切換介面（非正式認證，v1 內部使用）

---

## 七、降級（Degraded）顯示規格

當後端回傳 `degraded: true` 或 `/api/v1/system/health` 請求失敗時：

- 顯示「資料可能已過時」提示列（帶時戳 `last_good_data_at`）
- 仍顯示最後已知資料，不得顯示空白頁或錯誤畫面
- 健康檢查輪詢間隔：**≤ 10 秒**
- 偵測到降級後 **10 秒內** 須反映至 UI

---

## 八、效能目標

| 指標 | 目標值 |
|------|--------|
| 首次頁面載入 LCP | ≤ 2.5 秒（模擬 4G） |
| 可互動時間 TTI | ≤ 3.5 秒（模擬 4G） |
| 設備總覽完整顯示 | ≤ 3 秒 |
| 資料自動刷新間隔 | 60 秒（React Query `staleTime`） |
| 每個 PR bundle 增量 | ≤ 10 kB（gzip），超出需記錄並核准 |

---

## 九、主要整合工作項目（優先順序）

1. **型別對齊**
   - `DeviceStatus`：`abnormal → fault`，新增 `warning`
   - `riskScore: number → risk_level: "high" | "medium" | "low"`
   - `isRealApi → is_mock`（語意反轉）

2. **建立 API 請求層**
   - 在 `src/services/` 或 `src/lib/api/` 建立各端點的 React Query hooks
   - 統一注入 `X-Role` header（可透過 QueryClient 的 `defaultOptions` 或 Axios instance）

3. **替換 Mock 資料**
   - `app-state.tsx` 的本地 `useState` + `setInterval` 替換為 React Query 的資料請求
   - `lib/mocks/data.ts` 的種子資料僅保留開發/測試用途

4. **角色管理整合**
   - `localStorage` 持久化角色
   - React Context 提供全域角色狀態
   - 路由守衛依角色限制頁面存取與寫入操作

5. **降級提示元件**
   - 新增全域 `DegradedBanner` 元件，監聽 `/api/v1/system/health`
   - 整合至 `app-shell.tsx`

6. **月報列印**
   - `/monthly-report` 頁面加入 `window.print()` 觸發按鈕
   - 加入 `@media print` CSS（隱藏導覽列、調整版面）
   - 列印頁首須包含場域名稱與報告月份

---

## 十、缺欄位處理規則

- 所有數值顯示：`value ?? '--'`
- 趨勢圖資料中斷處：Recharts 使用 `connectNulls={false}` 顯示斷線
- 缺欄位清單由後端 `data_quality.missing_fields` 提供
