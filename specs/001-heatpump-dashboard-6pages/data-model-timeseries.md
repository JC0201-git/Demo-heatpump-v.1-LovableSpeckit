# 時序資料、缺欄位與狀態機

**所屬文件**：[data-model.md](./data-model.md)

---

## InfluxDB 1.8 Measurement

### `heatpump_status`

**Tags**

```text
device_id = "SITE01-001"
site_code = "SITE01"
model     = "THP-500A"
```

**Fields**

```text
temp_inlet       float
temp_outlet      float
temp_ambient     float
pressure_high    float
pressure_low     float
current_a        float
current_b        float
current_c        float
voltage_a        float
voltage_b        float
voltage_c        float
power_kw         float
cop              float
error_code       integer
run_mode         integer
compressor_hz    float
```

採集週期：每 5 分鐘。

### `power_meter`

v2 用電量分析預留，使用 tags：`device_id`、`site_code`、`meter_id`。欄位包含 `power_kw`、`voltage`、`current`、`power_factor`、`kwh_accum`、`freq_hz`。

### `system_health`

可選彙總 measurement，記錄 MySQL、InfluxDB、Node-RED 的健康度與延遲。

---

## 保存策略與連續查詢

```sql
CREATE RETENTION POLICY "rp_raw" ON "heatpump_db"
  DURATION 365d REPLICATION 1 DEFAULT;

CREATE RETENTION POLICY "rp_agg" ON "heatpump_db"
  DURATION INF REPLICATION 1;
```

小時彙總：

```sql
CREATE CONTINUOUS QUERY "cq_heatpump_1h" ON "heatpump_db"
BEGIN
  SELECT mean(temp_outlet) AS temp_outlet_avg,
         mean(pressure_high) AS pressure_high_avg,
         mean(power_kw) AS power_kw_avg,
         max(error_code) AS error_code_max,
         sum(power_kw) / 12 AS kwh_1h
  INTO "rp_agg"."heatpump_status_1h"
  FROM "rp_raw"."heatpump_status"
  GROUP BY time(1h), device_id, site_code
END;
```

每日彙總：

```sql
CREATE CONTINUOUS QUERY "cq_heatpump_1d" ON "heatpump_db"
BEGIN
  SELECT mean(temp_outlet) AS temp_outlet_avg,
         max(pressure_high) AS pressure_high_max,
         min(pressure_low) AS pressure_low_min,
         sum(power_kw) / 12 AS kwh_day
  INTO "rp_agg"."heatpump_status_1d"
  FROM "rp_agg"."heatpump_status_1h"
  GROUP BY time(1d), device_id, site_code
END;
```

---

## 缺欄位處理

後端 API 原則：

- 所有契約欄位都必須出現在回應中；無資料時回傳 `null`。
- `data_quality.missing_fields` 必須列出缺失欄位。
- `data_quality.last_updated_at` 表示該筆資料最後有效更新時間。
- 資料源不可用時回傳 `degraded: true` 與最後已知資料。

前端顯示原則：

- 數值欄位使用 `value ?? '--'`。
- 趨勢圖遇到 `null` 時斷線，不補 0。
- 降級狀態顯示「資料可能已過時」。

---

## 狀態機

設備狀態由後端每 5 分鐘更新：

| 目前狀態 | 條件 | 下一狀態 |
|----------|------|----------|
| 任意 | 超過 5 分鐘無資料 | `offline` |
| `normal` | 任一參數超出 warning 門檻 | `warning` |
| `normal`/`warning` | 任一參數超出 critical 門檻或 `error_code != 0` | `fault` |
| `warning`/`fault` | 所有參數恢復正常且無未解決 critical 告警 | `normal` |
| `offline` | 收到新資料並通過規則評定 | `normal`/`warning`/`fault` |

告警狀態：

```text
open -> acknowledged -> resolved
open -> resolved
```
