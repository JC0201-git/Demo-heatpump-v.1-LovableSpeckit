# REST API 契約：熱泵設備監控儀表板

**版本**：v1.0
**基礎路徑**：`/api/v1`
**回傳格式**：`application/json`
**時間格式**：ISO 8601（`2026-05-23T10:00:00+08:00`）

---

## 文件拆分

- [rest-api-core.md](./rest-api-core.md)：通用回傳、場域、設備、風險 API
- [rest-api-ops.md](./rest-api-ops.md)：告警、月報、老闆決策頁、系統健康度、角色限制

---

## 通用格式摘要

成功回傳：

```jsonc
{
  "success": true,
  "data": {},
  "meta": { "total": 80, "page": 1, "per_page": 20 }
}
```

錯誤回傳：

```jsonc
{
  "success": false,
  "error": { "code": "DEVICE_NOT_FOUND", "message": "找不到指定設備", "details": null }
}
```

降級回傳：

```jsonc
{
  "success": true,
  "data": {},
  "degraded": true,
  "degraded_reason": "InfluxDB 連線逾時",
  "last_good_data_at": "2026-05-23T09:55:00+08:00"
}
```

---

## 識別碼標準

- 對外 API 查詢、請求 body 與回應資料統一使用 `site_code` 表示場域。
- MySQL 內部 FK 可使用 `site_id`，但不得暴露為前端主要篩選參數。
- 設備使用 `device_id`，格式為 `SITExx-xxx`。

---

## 端點索引

| 類別 | 端點 | 詳細契約 |
|------|------|----------|
| 場域 | `GET /sites`, `POST /sites` | [rest-api-core.md](./rest-api-core.md#場域-api) |
| 設備 | `GET /devices`, `POST /devices`, `PATCH /devices/:device_id`, `GET /devices/:device_id`, `GET /devices/:device_id/history` | [rest-api-core.md](./rest-api-core.md#設備-api) |
| 風險 | `GET /risks`, `POST /risks` | [rest-api-core.md](./rest-api-core.md#風險排序-api) |
| 告警 | `GET /alerts`, `POST /alerts`, `PATCH /alerts/:id/acknowledge`, `PATCH /alerts/:id/resolve` | [rest-api-ops.md](./rest-api-ops.md#告警-api) |
| 月報 | `POST /reports/monthly`, `GET /reports/monthly`, `GET /reports/monthly/:id` | [rest-api-ops.md](./rest-api-ops.md#月報-api) |
| 決策頁 | `GET /dashboard/summary` | [rest-api-ops.md](./rest-api-ops.md#老闆決策頁-api) |
| 健康度 | `GET /system/health` | [rest-api-ops.md](./rest-api-ops.md#系統健康度-api) |
| 角色限制 | 全端點權限矩陣 | [rest-api-ops.md](./rest-api-ops.md#角色限制規範) |
