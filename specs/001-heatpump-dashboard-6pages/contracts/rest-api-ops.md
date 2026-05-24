# REST API 維運與報表契約

**所屬文件**：[rest-api.md](./rest-api.md)

---

## 告警 API

### `GET /api/v1/alerts`

取得告警清單。支援參數：`status`、`site_code`、`device_id`、`alert_type`、`severity`、`from`、`to`、`page`、`per_page`。

回應告警欄位必含：`id`、`device_id`、`site_code`、`alert_type`、`severity`、`status`、`triggered_at`、`acknowledged_at`、`resolved_at`、`resolution_notes`。

### `POST /api/v1/alerts`

手動建立告警。僅 `operator` 可呼叫。

```jsonc
{
  "device_id": "SITE01-001",
  "alert_type": "manual",
  "severity": "warning",
  "title": "人工巡檢異常",
  "description": "現場巡檢發現噪音偏高"
}
```

### `PATCH /api/v1/alerts/:id/acknowledge`

確認告警。僅 `operator` 可呼叫。後端寫入 `acknowledged_at`、`acknowledged_by`，狀態變為 `acknowledged`。

### `PATCH /api/v1/alerts/:id/resolve`

解決告警。僅 `operator` 可呼叫。

```jsonc
{
  "resolution_notes": "已清潔濾網並恢復正常"
}
```

## 月報 API

### `POST /api/v1/reports/monthly`

產生或更新月報快取。僅 `manager` 可呼叫；此端點是報表操作例外，只能寫入 `monthly_reports`，不得修改設備、風險或告警營運資料。

```jsonc
{
  "site_code": "SITE01",
  "year": 2026,
  "month": 4
}
```

月報可用率必須由 `status_snapshots` 計算。若報告月份內設備數量因監控起訖時間變動，`summary_html` 必須標示「本月設備數量曾變動」。

### `GET /api/v1/reports/monthly/:id`

取得月報詳情，回傳 `summary_html`、`availability_pct`、`total_alerts`、`critical_alerts`、`generated_at`。

### `GET /api/v1/reports/monthly`

取得月報清單。支援 `site_code`、`year` 篩選。

## 老闆決策頁 API

### `GET /api/v1/dashboard/summary`

取得跨場域彙整。僅 `manager` 可呼叫。

回應包含：

- `overall`：normal/warning/fault/offline 計數、本月告警數、未處理告警數。
- `sites`：各場域 `site_code`、設備健康度、當月/上月告警數、`needs_attention`。
- `needs_attention` 規則：本月告警數較上月增加至少 30%，且增加筆數至少 3 筆。

## 系統健康度 API

### `GET /api/v1/system/health`

回傳 MySQL、InfluxDB、Node-RED 狀態。

```jsonc
{
  "success": true,
  "data": {
    "mysql": { "status": "up", "checked_at": "2026-05-23T10:00:00+08:00" },
    "influxdb": { "status": "up", "checked_at": "2026-05-23T10:00:00+08:00" },
    "node_red": { "status": "up", "checked_at": "2026-05-23T10:00:00+08:00" }
  }
}
```

## 角色限制規範

| 端點 | `operator` | `manager` |
|------|------------|-----------|
| `GET /sites` | 是 | 是 |
| `POST /sites` | 是 | 否 |
| `GET /devices*` | 是 | 是 |
| `POST /devices` | 是 | 否 |
| `PATCH /devices/:device_id` | 是 | 否 |
| `GET /risks` | 是 | 是 |
| `POST /risks` | 是 | 否 |
| `GET /alerts` | 是 | 是 |
| `POST /alerts` | 是 | 否 |
| `PATCH /alerts/:id/*` | 是 | 否 |
| `POST /reports/monthly` | 否 | 是 |
| `GET /reports/monthly*` | 否 | 是 |
| `GET /dashboard/summary` | 否 | 是 |
| `GET /system/health` | 是 | 是 |

缺少 `X-Role` 或角色值不是 `operator`/`manager` 時，一律回傳 HTTP 403。
