# REST API 契約：熱泵設備監控儀表板

**版本**：v1.0
**基礎路徑**：`/api/v1`
**回傳格式**：`application/json`
**字元編碼**：UTF-8
**時間格式**：ISO 8601（`2026-05-23T10:00:00+08:00`）

---

## 通用回傳格式

### 成功回傳

```jsonc
{
  "success": true,
  "data": { /* 回傳資料 */ },
  "meta": {
    "total": 80,           // 列表類型才有
    "page": 1,             // 分頁類型才有
    "per_page": 20         // 分頁類型才有
  }
}
```

### 錯誤回傳

```jsonc
{
  "success": false,
  "error": {
    "code": "DEVICE_NOT_FOUND",
    "message": "找不到指定設備",
    "details": null        // 可選，除錯用
  }
}
```

### 降級狀態回傳（資料源不可用）

```jsonc
{
  "success": true,
  "data": { /* 最後已知資料 */ },
  "degraded": true,
  "degraded_reason": "InfluxDB 連線逾時",
  "last_good_data_at": "2026-05-23T09:55:00+08:00"
}
```

---

## 場域 API

### `GET /api/v1/sites`

取得所有啟用場域清單。

**請求**：無參數

**回傳**：
```jsonc
{
  "success": true,
  "data": [
    {
      "id": 1,
      "site_code": "SITE01",
      "name": "拉拉手游泳學院",
      "address": "台北市...",
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

新增場域主檔。

**角色限制**：僅 `operator` 可呼叫。

**請求 Body**：
```jsonc
{
  "site_code": "SITE04",
  "name": "新場域",
  "address": "台中市...",
  "contact": "王小明",
  "phone": "0912-000-000"
}
```

**回傳**：新增後的 site 物件。

---

## 設備 API

### `GET /api/v1/devices`

取得所有設備清單（含狀態，可依場域篩選）。

**查詢參數**：
| 參數 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `site_id` | integer | 否 | 篩選指定場域 |
| `status` | string | 否 | 篩選狀態：`normal`/`warning`/`fault`/`offline` |
| `page` | integer | 否 | 頁碼（預設 1） |
| `per_page` | integer | 否 | 每頁筆數（預設 20，最大 100） |

**回傳**：
```jsonc
{
  "success": true,
  "data": [
    {
      "id": 1,
      "device_id": "SITE01-001",
      "name": "泳池熱泵 A",
      "model": "THP-500A",
      "site_id": 1,
      "site_code": "SITE01",
      "site_name": "拉拉手游泳學院",
      "is_mock": false,
      "current_status": "normal",
      "status_updated_at": "2026-05-23T10:00:00+08:00",
      "installed_at": "2024-01-15",
      "monitoring_started_at": "2024-01-15T00:00:00+08:00",
      "monitoring_ended_at": null,
      "risk_level": "low",           // 當前風險等級（null 若未指派）
      "data": {
        "temp_outlet":   28.5,
        "pressure_high": 18.2,
        "current_a":     12.8,
        "power_kw":      12.3,
        "error_code":    0
      },
      "data_quality": {
        "available_fields": ["temp_outlet", "pressure_high", "current_a", "power_kw", "error_code"],
        "missing_fields":   [],
        "last_updated_at":  "2026-05-23T09:55:00+08:00"
      }
    }
  ],
  "meta": { "total": 80, "page": 1, "per_page": 20 }
}
```

---

### `POST /api/v1/devices`

新增設備主檔。

**角色限制**：僅 `operator` 可呼叫。

**請求 Body**：
```jsonc
{
  "site_id": 1,
  "device_id": "SITE01-004",
  "name": "泳池熱泵 D",
  "model": "THP-500A",
  "installed_at": "2026-05-01",
  "monitoring_started_at": "2026-05-01T00:00:00+08:00",
  "monitoring_ended_at": null,
  "is_mock": true
}
```

**回傳**：新增後的 device 物件。

---

### `PATCH /api/v1/devices/:device_id`

更新設備主檔與監控期間。

**角色限制**：僅 `operator` 可呼叫。

**請求 Body**：
```jsonc
{
  "name": "泳池熱泵 D",
  "monitoring_started_at": "2026-05-01T00:00:00+08:00",
  "monitoring_ended_at": null,
  "is_active": true
}
```

**回傳**：更新後的 device 物件。

---

### `GET /api/v1/devices/:device_id`

取得單一設備詳情。

**路徑參數**：`device_id`（設備識別碼）

**回傳**：同 `GET /api/v1/devices` 單筆格式，欄位更完整：
```jsonc
{
  "success": true,
  "data": {
    "id": 1,
    "device_id": "SITE01-001",
    "name": "泳池熱泵 A",
    "model": "THP-500A",
    "site_id": 1,
    "site_code": "SITE01",
    "site_name": "拉拉手游泳學院",
    "installed_at": "2024-01-15",
    "monitoring_started_at": "2024-01-15T00:00:00+08:00",
    "monitoring_ended_at": null,
    "notes": "",
    "is_mock": false,
    "current_status": "normal",
    "status_updated_at": "2026-05-23T10:00:00+08:00",
    "current_risk": {
      "risk_level": "low",
      "assigned_by": "維運人員",
      "assigned_at": "2026-05-20T09:00:00+08:00",
      "notes": "近期運作穩定"
    },
    "latest_data": {
      "temp_inlet":    22.1,
      "temp_outlet":   28.5,
      "pressure_high": 18.2,
      "pressure_low":  5.4,
      "current_a":     12.8,
      "voltage_a":     220.0,
      "power_kw":      12.3,
      "error_code":    0,
      "last_updated_at": "2026-05-23T09:55:00+08:00"
    },
    "data_quality": {
      "available_fields": ["temp_inlet","temp_outlet","pressure_high","pressure_low","current_a","voltage_a","power_kw","error_code"],
      "missing_fields": [],
      "last_updated_at": "2026-05-23T09:55:00+08:00"
    }
  }
}
```

---

### `GET /api/v1/devices/:device_id/history`

取得設備歷史時序資料（用於單機履歷圖表）。

**查詢參數**：
| 參數 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `field` | string | 是 | 欄位名稱（如 `temp_outlet`, `power_kw`） |
| `from` | string | 是 | 起始時間（ISO 8601） |
| `to` | string | 是 | 結束時間（ISO 8601） |
| `resolution` | string | 否 | 資料解析度：`5m`/`1h`/`1d`（預設依時間範圍自動選擇） |

**回傳**：
```jsonc
{
  "success": true,
  "data": {
    "device_id": "SITE01-001",
    "field": "temp_outlet",
    "resolution": "1h",
    "points": [
      { "time": "2026-05-23T08:00:00+08:00", "value": 27.8 },
      { "time": "2026-05-23T09:00:00+08:00", "value": 28.1 },
      { "time": "2026-05-23T10:00:00+08:00", "value": 28.5 }
    ]
  }
}
```

**解析度自動選擇規則**：
- 時間範圍 ≤ 1 天 → `5m`（原始資料）
- 時間範圍 ≤ 7 天 → `1h`（小時彙總）
- 時間範圍 > 7 天 → `1d`（日彙總）

---

## 風險排序 API

### `GET /api/v1/risks`

取得所有設備風險排序清單（依風險等級降序，同等級依最後告警時間排序）。

**查詢參數**：
| 參數 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `site_id` | integer | 否 | 篩選指定場域 |

**回傳**：
```jsonc
{
  "success": true,
  "data": [
    {
      "heat_pump_id": 1,
      "device_id": "SITE01-001",
      "name": "泳池熱泵 A",
      "site_name": "拉拉手游泳學院",
      "current_status": "warning",
      "risk_level": "high",
      "assigned_by": "維運人員",
      "assigned_at": "2026-05-22T14:00:00+08:00",
      "notes": "壓力偏高，需優先檢查",
      "open_alert_count": 2
    }
  ]
}
```

---

### `POST /api/v1/risks`

指派或更新設備風險等級。

**角色限制**：僅 `operator`（維運人員）可呼叫；`manager` 呼叫時回傳 403。

**請求 Body**：
```jsonc
{
  "heat_pump_id": 1,
  "risk_level": "high",         // "high" | "medium" | "low"
  "notes": "壓力偏高，需優先檢查",
  "assigned_by": "維運人員"     // v1 直接傳角色名稱
}
```

**回傳**：
```jsonc
{
  "success": true,
  "data": {
    "id": 5,
    "heat_pump_id": 1,
    "risk_level": "high",
    "assigned_by": "維運人員",
    "assigned_at": "2026-05-23T10:00:00+08:00",
    "notes": "壓力偏高，需優先檢查"
  }
}
```

---

## 告警 API

### `GET /api/v1/alerts`

取得告警清單（支援篩選）。

**查詢參數**：
| 參數 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `status` | string | 否 | `open`/`acknowledged`/`resolved`（可多值，逗號分隔） |
| `site_id` | integer | 否 | 篩選場域 |
| `heat_pump_id` | integer | 否 | 篩選設備 |
| `alert_type` | string | 否 | `offline`/`error_code`/`threshold`/`manual` |
| `from` | string | 否 | 起始時間（ISO 8601） |
| `to` | string | 否 | 結束時間（ISO 8601） |
| `page` | integer | 否 | 頁碼 |
| `per_page` | integer | 否 | 每頁筆數（預設 20） |

**回傳**：
```jsonc
{
  "success": true,
  "data": [
    {
      "id": 10,
      "heat_pump_id": 1,
      "device_name": "泳池熱泵 A",
      "site_name": "拉拉手游泳學院",
      "alert_type": "threshold",
      "severity": "warning",
      "title": "出水溫度超限",
      "description": "出水溫度 35.2°C 超過警戒值 33°C",
      "error_code": null,
      "triggered_at": "2026-05-23T09:30:00+08:00",
      "acknowledged_at": null,
      "acknowledged_by": null,
      "resolved_at": null,
      "resolved_by": null,
      "resolution_notes": null,
      "status": "open"
    }
  ],
  "meta": { "total": 5, "page": 1, "per_page": 20 }
}
```

---

### `POST /api/v1/alerts`

手動建立告警。

**角色限制**：僅 `operator` 可呼叫。

**請求 Body**：
```jsonc
{
  "heat_pump_id": 1,
  "alert_type": "manual",
  "severity": "warning",
  "title": "現場發現異常噪音",
  "description": "技師現場巡檢時發現壓縮機有異常噪音",
  "triggered_at": "2026-05-23T10:00:00+08:00"
}
```

---

### `PATCH /api/v1/alerts/:id/acknowledge`

確認告警。

**角色限制**：僅 `operator` 可呼叫。

**請求 Body**：
```jsonc
{
  "acknowledged_by": "維運人員"
}
```

**回傳**：更新後的 alert 物件

---

### `PATCH /api/v1/alerts/:id/resolve`

解決告警。

**角色限制**：僅 `operator` 可呼叫。

**請求 Body**：
```jsonc
{
  "resolved_by": "維運人員",
  "resolution_notes": "已更換壓縮機潤滑油，出水溫度恢復正常"
}
```

**回傳**：更新後的 alert 物件

---

## 月報 API

### `POST /api/v1/reports/monthly`

產生月報（建立或更新月報快取）。

**角色限制**：僅 `manager`（高層管理者）可呼叫；此端點是 manager 報表操作例外，只能建立或更新 `monthly_reports` 快取，不得修改設備、風險或告警營運資料。

**月報計算規則**：`availability_pct` 必須由 `status_snapshots` 計算，不得以 `heat_pumps.current_status` 回推。若報告月份內設備因 `monitoring_started_at` 或 `monitoring_ended_at` 造成設備數量變動，後端必須在 `summary_html` 中標示「本月設備數量曾變動」，並以各設備實際納入監控期間作為可用率分母。

**請求 Body**：
```jsonc
{
  "site_id": 1,
  "year": 2026,
  "month": 4
}
```

**回傳**：
```jsonc
{
  "success": true,
  "data": {
    "id": 3,
    "site_id": 1,
    "site_name": "拉拉手游泳學院",
    "report_year": 2026,
    "report_month": 4,
    "generated_at": "2026-05-23T10:05:00+08:00",
    "total_devices": 3,
    "availability_pct": 98.5,
    "total_alerts": 2,
    "critical_alerts": 0,
    "total_kwh": 1234.56,
    "summary_html": "<html>...</html>",
    "status": "draft"
  }
}
```

---

### `GET /api/v1/reports/monthly/:id`

取得月報詳情（含 HTML）。

**回傳**：同 `POST /api/v1/reports/monthly` 回傳格式

---

### `GET /api/v1/reports/monthly`

取得月報清單。

**查詢參數**：
| 參數 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `site_id` | integer | 否 | 篩選場域 |
| `year` | integer | 否 | 篩選年份 |

---

## 老闆決策頁 API

### `GET /api/v1/dashboard/summary`

取得跨場域彙整摘要（老闆決策頁）。

**回傳**：
```jsonc
{
  "success": true,
  "data": {
    "generated_at": "2026-05-23T10:00:00+08:00",
    "overall": {
      "total_sites": 3,
      "total_devices": 80,
      "normal_count": 72,
      "warning_count": 5,
      "fault_count": 1,
      "offline_count": 2,
      "open_alerts": 8,
      "this_month_alerts": 15,
      "last_month_alerts": 11
    },
    "sites": [
      {
        "site_id": 1,
        "site_name": "拉拉手游泳學院",
        "device_count": 3,
        "normal_count": 2,
        "warning_count": 1,
        "fault_count": 0,
        "offline_count": 0,
        "this_month_alerts": 3,
        "last_month_alerts": 1
      }
    ]
  }
}
```

---

## 系統健康度 API

### `GET /api/v1/system/health`

取得後端系統健康度（供前端偵測降級狀態）。

**回傳**：
```jsonc
{
  "success": true,
  "data": {
    "status": "healthy",          // "healthy" | "degraded" | "down"
    "services": {
      "mysql":    { "status": "up",   "latency_ms": 5 },
      "influxdb": { "status": "up",   "latency_ms": 12 },
      "nodered":  { "status": "up",   "latency_ms": 8 }
    },
    "checked_at": "2026-05-23T10:00:00+08:00"
  }
}
```

---

## 角色限制規範

| 端點 | `operator`（維運人員） | `manager`（高層管理者） |
|----------|----------------------|----------------------|
| `GET /api/v1/sites` | ✅ | ✅ |
| `POST /api/v1/sites` | ✅ | ❌（403） |
| `GET /api/v1/devices` | ✅ | ✅ |
| `POST /api/v1/devices` | ✅ | ❌（403） |
| `GET /api/v1/devices/:device_id` | ✅ | ✅ |
| `PATCH /api/v1/devices/:device_id` | ✅ | ❌（403） |
| `GET /api/v1/devices/:device_id/history` | ✅ | ✅ |
| `GET /api/v1/risks` | ✅ | ✅ |
| `POST /api/v1/risks` | ✅ | ❌（403） |
| `GET /api/v1/alerts` | ✅ | ✅ |
| `POST /api/v1/alerts` | ✅ | ❌（403） |
| `PATCH /api/v1/alerts/:id/acknowledge` | ✅ | ❌（403） |
| `PATCH /api/v1/alerts/:id/resolve` | ✅ | ❌（403） |
| `POST /api/v1/reports/monthly` | ❌（403） | ✅ |
| `GET /api/v1/reports/monthly` | ❌（403） | ✅ |
| `GET /api/v1/dashboard/summary` | ❌（403） | ✅ |
| `GET /api/v1/system/health` | ✅ | ✅ |

**v1 角色驗證方式**：前端在每個請求的 HTTP 標頭加入 `X-Role: operator` 或 `X-Role: manager`；
後端讀取此標頭判斷角色限制。

**manager 寫入例外**：`POST /api/v1/reports/monthly` 僅允許更新報表快取，視為報表產生行為；manager 仍不得建立/修改設備、風險或告警營運資料。

**安全說明**：此機制僅用於 v1 Demo，不視為正式安全控制。v2 需替換為 JWT。
