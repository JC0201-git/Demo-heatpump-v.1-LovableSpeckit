# REST API 核心資源契約

**所屬文件**：[rest-api.md](./rest-api.md)

---

## 場域 API

### `GET /api/v1/sites`

取得啟用場域清單。

**回應重點欄位**：`site_code`、`name`、`address`、`device_count`、`normal_count`、`warning_count`、`fault_count`、`offline_count`。

```jsonc
{
  "success": true,
  "data": [
    {
      "site_code": "SITE01",
      "name": "拉拉手游泳學院",
      "device_count": 3,
      "normal_count": 2,
      "warning_count": 1,
      "fault_count": 0,
      "offline_count": 0
    }
  ]
}
```

### `POST /api/v1/sites`

新增場域主檔。僅 `operator` 可呼叫。

```jsonc
{
  "site_code": "SITE04",
  "name": "新場域",
  "address": "台中市...",
  "contact": "王小明",
  "phone": "0912-000-000"
}
```

## 設備 API

### `GET /api/v1/devices`

取得設備清單。查詢參數：

| 參數 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `site_code` | string | 否 | 篩選指定場域 |
| `status` | string | 否 | `normal`/`warning`/`fault`/`offline` |
| `page` | integer | 否 | 預設 1 |
| `per_page` | integer | 否 | 預設 20，最大 100 |

回應設備欄位必含：`device_id`、`site_code`、`site_name`、`is_mock`、`current_status`、`status_updated_at`、`monitoring_started_at`、`monitoring_ended_at`、`risk_level`、`data`、`data_quality`。

`data` 至少支援 `temp_outlet`、`pressure_high`、`current_a`、`power_kw`、`error_code`。

### `POST /api/v1/devices`

新增設備主檔。僅 `operator` 可呼叫。

```jsonc
{
  "site_code": "SITE01",
  "device_id": "SITE01-004",
  "name": "泳池熱泵 D",
  "model": "THP-500A",
  "installed_at": "2026-05-01",
  "monitoring_started_at": "2026-05-01T00:00:00+08:00",
  "monitoring_ended_at": null,
  "is_mock": true
}
```

### `PATCH /api/v1/devices/:device_id`

更新設備主檔與監控期間。僅 `operator` 可呼叫。

```jsonc
{
  "name": "泳池熱泵 D",
  "monitoring_started_at": "2026-05-01T00:00:00+08:00",
  "monitoring_ended_at": null,
  "is_active": true
}
```

### `GET /api/v1/devices/:device_id`

取得單一設備詳情。回應同 `GET /devices` 單筆格式，另含 `current_risk` 與 `latest_data`。

### `GET /api/v1/devices/:device_id/history`

取得歷史時序資料。

| 參數 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `field` | string | 是 | 例如 `temp_outlet`、`pressure_high`、`current_a` |
| `from` | ISO 8601 | 是 | 起始時間 |
| `to` | ISO 8601 | 是 | 結束時間 |

解析度規則：`<=1d` 使用 5m，`<=7d` 使用 1h，`>7d` 使用 1d。

## 風險排序 API

### `GET /api/v1/risks`

取得風險排序清單。支援 `site_code` 篩選。排序規則：`high -> medium -> low`，同等級依最後告警時間排序。

### `POST /api/v1/risks`

指派或更新設備風險等級。僅 `operator` 可呼叫。

```jsonc
{
  "device_id": "SITE01-001",
  "risk_level": "high",
  "notes": "近期壓力偏高"
}
```

後端必須將同設備舊的 `is_current` 紀錄改為 0。
