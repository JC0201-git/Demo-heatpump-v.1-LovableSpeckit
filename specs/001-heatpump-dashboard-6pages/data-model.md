# 資料模型設計：熱泵設備監控儀表板

**所屬功能分支**：`001-heatpump-dashboard-6pages`
**建立日期**：2026-05-23
**階段**：第 1 階段 — 資料模型設計

---

## 文件拆分

本文件是資料模型索引。詳細內容拆分如下，避免單一文件過長：

- [data-model-mysql.md](./data-model-mysql.md)：MySQL 資料表、索引、關聯與月報可用率資料來源
- [data-model-timeseries.md](./data-model-timeseries.md)：InfluxDB measurement、保存策略、缺欄位處理與狀態機

---

## 核心資料分工

| 類型 | 儲存位置 | 說明 |
|------|----------|------|
| 場域、設備主檔 | MySQL | 業務資料、角色控管與月報分母依據 |
| 風險指派、告警、保養、月報 | MySQL | 需要關聯查詢與生命週期紀錄 |
| 每 5 分鐘狀態快照 | MySQL `status_snapshots` | FR-014 指定的月報可用率唯一歷史來源 |
| 即時與歷史感測器讀值 | InfluxDB `heatpump_status` | 5 分鐘時序資料，供即時/歷史趨勢與告警規則使用 |
| 電錶資料 | InfluxDB `power_meter` | v2 用電量與節能分析預留 |

---

## 識別碼標準

- MySQL 內部關聯使用整數主鍵 `id` 與 FK，例如 `site_id`、`heat_pump_id`。
- 對外 API、InfluxDB tag、設備編號與使用者可見識別統一使用 `site_code` 與 `device_id`。
- `site_code` 格式為 `SITExx`，例如 `SITE01`。
- `device_id` 格式為 `SITExx-xxx`，例如 `SITE01-001`。

---

## v1 必要資料表

| 資料表 | 主要用途 | 詳細定義 |
|--------|----------|----------|
| `sites` | 客戶場域，含唯一 `site_code` | [MySQL 設計](./data-model-mysql.md#11-sites客戶場域) |
| `heat_pumps` | 設備主檔、目前狀態、監控期間 | [MySQL 設計](./data-model-mysql.md#12-heat_pumps熱泵設備主檔) |
| `risk_assignments` | 風險等級歷史紀錄 | [MySQL 設計](./data-model-mysql.md#13-risk_assignments風險等級指派) |
| `alerts` | 告警生命週期 | [MySQL 設計](./data-model-mysql.md#14-alerts告警紀錄) |
| `maintenance_records` | 保養紀錄 | [MySQL 設計](./data-model-mysql.md#15-maintenance_records保養紀錄) |
| `monthly_reports` | 月報 HTML 與統計快取 | [MySQL 設計](./data-model-mysql.md#16-monthly_reports月報紀錄) |
| `status_snapshots` | 每 5 分鐘設備狀態快照 | [MySQL 設計](./data-model-mysql.md#17-status_snapshots設備狀態快照) |

---

## 時序資料與狀態規則

- `heatpump_status` 保存溫度、壓力、`current_a`、功率、`error_code` 等 v1 監控欄位。
- `rp_raw` 保留 365 天；`rp_agg` 永久保存小時與日彙總。
- 缺欄位 API 回傳 `null` 並放入 `data_quality.missing_fields`，前端以 `--` 顯示。
- 設備狀態由後端每 5 分鐘依正常、警告、異常、離線規則評定。

完整定義見 [data-model-timeseries.md](./data-model-timeseries.md)。
