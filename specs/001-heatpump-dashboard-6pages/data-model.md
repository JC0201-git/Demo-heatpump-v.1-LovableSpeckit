# 資料模型設計：熱泵設備監控儀表板

**所屬功能分支**：`001-heatpump-dashboard-6pages`
**建立日期**：2026-05-23
**階段**：第 1 階段 — 資料模型設計

---

## 一、MySQL 資料表設計

### 1.1 `sites`（客戶場域）

```sql
CREATE TABLE sites (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  site_code   VARCHAR(20)     NOT NULL COMMENT '場域代碼，如：SITE01',
  name        VARCHAR(100)    NOT NULL COMMENT '場域名稱，如：拉拉手游泳學院',
  address     VARCHAR(255)    NOT NULL DEFAULT '' COMMENT '場域地址',
  contact     VARCHAR(100)    NOT NULL DEFAULT '' COMMENT '聯絡人姓名',
  phone       VARCHAR(30)     NOT NULL DEFAULT '' COMMENT '聯絡電話',
  is_active   TINYINT(1)      NOT NULL DEFAULT 1 COMMENT '是否啟用（0=停用）',
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_site_code (site_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客戶場域主檔';
```

**索引**：PRIMARY KEY(id)、UNIQUE KEY(site_code)

**欄位說明**：
- `site_code`：系統指派的唯一場域代碼，設備編號與 InfluxDB `site_id` tag 必須使用同一代碼

**種子資料**：
- `SITE01`：拉拉手游泳學院（3 台真實 + 若干模擬設備）
- `SITE02`：洗衣廠（若干模擬設備）
- `SITE03`：罐頭工廠（若干模擬設備）

---

### 1.2 `heat_pumps`（熱泵設備主檔）

```sql
CREATE TABLE heat_pumps (
  id               INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  site_id          INT UNSIGNED    NOT NULL COMMENT '所屬場域 FK → sites.id',
  device_id        VARCHAR(50)     NOT NULL COMMENT '設備唯一識別碼，對應 InfluxDB tag',
  name             VARCHAR(100)    NOT NULL COMMENT '設備顯示名稱',
  model            VARCHAR(100)    NOT NULL DEFAULT '' COMMENT '設備型號',
  installed_at     DATE            NOT NULL COMMENT '裝機日期',
  monitoring_started_at DATETIME   NOT NULL COMMENT '納入監控開始時間，預設為裝機日期 00:00:00',
  monitoring_ended_at   DATETIME   NULL     COMMENT '移除或停止納入監控時間（NULL = 仍納入監控）',
  is_mock          TINYINT(1)      NOT NULL DEFAULT 0 COMMENT '是否為模擬設備（0=真實，1=模擬）',
  is_active        TINYINT(1)      NOT NULL DEFAULT 1 COMMENT '是否仍納入即時監控',
  current_status   ENUM('normal','warning','fault','offline') NOT NULL DEFAULT 'offline'
                   COMMENT '設備目前狀態（由後端排程更新）',
  status_updated_at DATETIME       NULL     COMMENT '狀態最後更新時間',
  notes            TEXT            NULL     COMMENT '設備備註',
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_device_id (device_id),
  KEY idx_site_id (site_id),
  KEY idx_current_status (current_status),
  KEY idx_monitoring_window (monitoring_started_at, monitoring_ended_at),
  CONSTRAINT fk_hp_site FOREIGN KEY (site_id) REFERENCES sites(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='熱泵設備主檔';
```

**欄位說明**：
- `device_id`：對應 InfluxDB 量測表中的標籤 `device_id`，串接真實資料的關鍵欄位
- `monitoring_started_at`：設備納入監控與月報可用率分母計算的開始時間；月中新增設備自此時間開始計算
- `monitoring_ended_at`：設備移除或停止納入監控的時間；NULL 代表仍納入監控。月中移除設備計算至此時間或最後納入監控時間
- `is_mock`：區分真實設備（3 台）與模擬設備（77 台）
- `current_status`：由後端 5 分鐘排程更新，前端直接讀取此欄位，不需每次即時計算
- `is_active = 0` 的設備不預設顯示於即時總覽，但其歷史資料、告警與狀態快照必須保留，供跨月月報與單機履歷查詢

---

### 1.3 `risk_assignments`（風險等級指派）

```sql
CREATE TABLE risk_assignments (
  id               INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  heat_pump_id     INT UNSIGNED    NOT NULL COMMENT 'FK → heat_pumps.id',
  risk_level       ENUM('high','medium','low') NOT NULL COMMENT '風險等級',
  assigned_by      VARCHAR(100)    NOT NULL DEFAULT 'operator' COMMENT '指派人員（v1 為角色名稱）',
  assigned_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '指派時間',
  notes            TEXT            NULL     COMMENT '風險指派備註',
  is_current       TINYINT(1)      NOT NULL DEFAULT 1 COMMENT '是否為當前有效指派',
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_heat_pump_id (heat_pump_id),
  KEY idx_is_current (is_current),
  KEY idx_risk_level (risk_level),
  CONSTRAINT fk_ra_hp FOREIGN KEY (heat_pump_id) REFERENCES heat_pumps(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='設備風險等級指派紀錄';
```

**業務規則**：
- 每台設備只能有一筆 `is_current = 1` 的記錄（由後端 API 在新增時將舊記錄改為 0）
- 歷史指派記錄永久保存，供單機履歷查閱
- v1 `assigned_by` 儲存角色名稱（如「維運人員」）；v2 替換為 `user_id FK → users.id`

---

### 1.4 `alerts`（告警紀錄）

```sql
CREATE TABLE alerts (
  id               INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  heat_pump_id     INT UNSIGNED    NOT NULL COMMENT 'FK → heat_pumps.id',
  alert_type       ENUM('offline','error_code','threshold','manual') NOT NULL COMMENT '告警類型',
  severity         ENUM('critical','warning','info') NOT NULL DEFAULT 'warning' COMMENT '嚴重程度',
  title            VARCHAR(200)    NOT NULL COMMENT '告警標題',
  description      TEXT            NULL     COMMENT '告警詳情（錯誤碼/超限數值等）',
  error_code       VARCHAR(50)     NULL     COMMENT '錯誤碼（告警類型為 error_code 時使用）',
  triggered_at     DATETIME        NOT NULL COMMENT '告警觸發時間',
  acknowledged_at  DATETIME        NULL     COMMENT '確認時間（NULL = 未確認）',
  acknowledged_by  VARCHAR(100)    NULL     COMMENT '確認人員',
  resolved_at      DATETIME        NULL     COMMENT '解決時間（NULL = 未解決）',
  resolved_by      VARCHAR(100)    NULL     COMMENT '解決人員',
  resolution_notes TEXT            NULL     COMMENT '處理備註（解決時填寫）',
  status           ENUM('open','acknowledged','resolved') NOT NULL DEFAULT 'open',
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_heat_pump_id (heat_pump_id),
  KEY idx_status (status),
  KEY idx_triggered_at (triggered_at),
  KEY idx_alert_type (alert_type),
  CONSTRAINT fk_alert_hp FOREIGN KEY (heat_pump_id) REFERENCES heat_pumps(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='告警紀錄';
```

**告警生命週期**：`open` → `acknowledged` → `resolved`

**v1 實作的告警類型**：
- `offline`：超過 5 分鐘無資料（後端排程自動觸發）
- `error_code`：設備回傳非零錯誤碼（後端排程自動觸發）
- `threshold`：固定門檻超限（後端排程自動觸發）
- `manual`：維運人員手動建立告警

**v2 預留**：`scheduled` 保養提醒、`prediction` 預測性告警

---

### 1.5 `maintenance_records`（保養紀錄）

```sql
CREATE TABLE maintenance_records (
  id               INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  heat_pump_id     INT UNSIGNED    NOT NULL COMMENT 'FK → heat_pumps.id',
  maintained_at    DATE            NOT NULL COMMENT '保養日期',
  technician       VARCHAR(100)    NOT NULL DEFAULT '' COMMENT '技師姓名',
  maintenance_type VARCHAR(100)    NOT NULL DEFAULT '定期保養' COMMENT '保養類型',
  summary          TEXT            NULL     COMMENT '保養摘要',
  parts_replaced   TEXT            NULL     COMMENT '更換零件清單（JSON 字串或文字）',
  next_scheduled   DATE            NULL     COMMENT '下次預定保養日期',
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_heat_pump_id (heat_pump_id),
  KEY idx_maintained_at (maintained_at),
  CONSTRAINT fk_mr_hp FOREIGN KEY (heat_pump_id) REFERENCES heat_pumps(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='設備保養紀錄';
```

---

### 1.6 `monthly_reports`（月報紀錄）

```sql
CREATE TABLE monthly_reports (
  id               INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  site_id          INT UNSIGNED    NOT NULL COMMENT 'FK → sites.id',
  report_year      SMALLINT        NOT NULL COMMENT '報告年份',
  report_month     TINYINT         NOT NULL COMMENT '報告月份（1-12）',
  generated_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '產生時間',
  generated_by     VARCHAR(100)    NOT NULL DEFAULT 'manager' COMMENT '產生人員',
  total_devices    SMALLINT        NOT NULL DEFAULT 0 COMMENT '場域設備總數',
  availability_pct DECIMAL(5,2)    NOT NULL DEFAULT 0.00 COMMENT '可用率（%）',
  total_alerts     INT             NOT NULL DEFAULT 0 COMMENT '告警次數',
  critical_alerts  INT             NOT NULL DEFAULT 0 COMMENT '重大告警次數',
  total_kwh        DECIMAL(12,2)   NULL     COMMENT '本月用電量（kWh）',
  summary_html     MEDIUMTEXT      NOT NULL COMMENT '月報 HTML 內容',
  status           ENUM('draft','final') NOT NULL DEFAULT 'draft',
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_site_year_month (site_id, report_year, report_month),
  KEY idx_site_id (site_id),
  CONSTRAINT fk_mr_site FOREIGN KEY (site_id) REFERENCES sites(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='月報紀錄';
```

**業務規則**：
- 同一場域同一月份只能有一份月報（UNIQUE KEY）
- `summary_html` 儲存後端產生的完整 HTML 字串，前端可直接 `innerHTML` 渲染並列印
- 月報重新產生時更新現有記錄（UPSERT 語義）
- `availability_pct` 必須由 `status_snapshots` 依設備實際納入監控期間計算，不得由 `heat_pumps.current_status` 推估
- 報告月份內若任一設備的 `monitoring_started_at` 或 `monitoring_ended_at` 落在該月，`summary_html` 必須標示該月份設備數量曾變動

---

### 1.7 `status_snapshots`（設備狀態快照）

```sql
CREATE TABLE status_snapshots (
  id               INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  heat_pump_id     INT UNSIGNED    NOT NULL COMMENT 'FK → heat_pumps.id',
  snapshot_at      DATETIME        NOT NULL COMMENT '狀態快照時間，需對齊 5 分鐘採集區間',
  status           ENUM('normal','warning','fault','offline') NOT NULL COMMENT '該 5 分鐘區間的設備狀態',
  source           VARCHAR(50)     NOT NULL DEFAULT 'statusUpdater' COMMENT '快照來源：InfluxDB/mock/statusUpdater',
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_hp_snapshot (heat_pump_id, snapshot_at),
  KEY idx_snapshot_at (snapshot_at),
  KEY idx_status (status),
  CONSTRAINT fk_ss_hp FOREIGN KEY (heat_pump_id) REFERENCES heat_pumps(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='設備每 5 分鐘狀態快照';
```

**業務規則**：
- `status_snapshots` 是 FR-014 指定的月報可用率唯一歷史來源；不得只讀 `heat_pumps.current_status` 回推歷史可用率
- `statusUpdater` 每 5 分鐘為仍納入監控的設備寫入一筆快照；同一設備同一 `snapshot_at` 僅允許一筆記錄
- 月報計算單台設備分母時，採用 `max(月初, monitoring_started_at)` 至 `min(次月月初, monitoring_ended_at 或次月月初)` 之間的 5 分鐘區間數
- `normal` 與 `warning` 計為可用；`fault` 與 `offline` 計為不可用

---

## 二、關聯圖

```
sites (1) ──────── (N) heat_pumps
                         │
              ┌──────────┼───────────────┬──────────────────┐
              │          │               │                  │
    risk_assignments  alerts   maintenance_records   status_snapshots
    (N, history)      (N)             (N)              (N, 5m history)

sites (1) ──── (N) monthly_reports
```

---

## 三、InfluxDB 1.8 Measurement 設計

### 3.1 `heatpump_status`（熱泵設備時序資料）

**標籤**（索引維度，不變更）：
```
device_id      = "SITE01-001"        # 對應 heat_pumps.device_id
site_id        = "SITE01"         # 場域識別
model          = "THP-500A"      # 設備型號（可用於按型號查詢）
```

**欄位**（數值量測，可缺欄位）：
```
temp_inlet       float   # 進水溫度（°C）
temp_outlet      float   # 出水溫度（°C）
temp_ambient     float   # 環境溫度（°C）
pressure_high    float   # 高壓側壓力（bar）
pressure_low     float   # 低壓側壓力（bar）
current_a        float   # 電流 A 相（A）
current_b        float   # 電流 B 相（A，可缺）
current_c        float   # 電流 C 相（A，可缺）
voltage_a        float   # 電壓 A 相（V）
voltage_b        float   # 電壓 B 相（V，可缺）
voltage_c        float   # 電壓 C 相（V，可缺）
power_kw         float   # 即時功率（kW）
cop              float   # 性能係數（可缺）
error_code       integer # 錯誤碼（0 = 正常）
run_mode         integer # 運轉模式代碼（可缺）
compressor_hz    float   # 壓縮機頻率（Hz，可缺）
```

**採集週期**：每 5 分鐘

**保存策略**：
```
CREATE RETENTION POLICY "rp_raw" ON "heatpump_db"
  DURATION 365d REPLICATION 1 DEFAULT;

CREATE RETENTION POLICY "rp_agg" ON "heatpump_db"
  DURATION INF REPLICATION 1;
```

**連續查詢（每小時彙總）**：
```sql
CREATE CONTINUOUS QUERY "cq_heatpump_1h"
ON "heatpump_db"
BEGIN
  SELECT mean(temp_outlet) AS temp_outlet_avg,
         mean(pressure_high) AS pressure_high_avg,
         mean(power_kw) AS power_kw_avg,
         max(error_code) AS error_code_max,
         sum(power_kw) / 12 AS kwh_1h
  INTO "rp_agg"."heatpump_status_1h"
  FROM "rp_raw"."heatpump_status"
  GROUP BY time(1h), device_id, site_id
END;
```

**連續查詢（每日彙總）**：
```sql
CREATE CONTINUOUS QUERY "cq_heatpump_1d"
ON "heatpump_db"
BEGIN
  SELECT mean(temp_outlet) AS temp_outlet_avg,
         max(pressure_high) AS pressure_high_max,
         min(pressure_low) AS pressure_low_min,
         sum(power_kw) / 12 AS kwh_day
  INTO "rp_agg"."heatpump_status_1d"
  FROM "rp_agg"."heatpump_status_1h"
  GROUP BY time(1d), device_id, site_id
END;
```

---

### 3.2 `power_meter`（智慧電錶時序資料）

**標籤**：
```
device_id      = "SITE01-001"    # 對應熱泵設備 device_id
site_id        = "SITE01"
meter_id       = "MTR-001"       # 電錶識別（一台熱泵可能有多個電錶）
```

**欄位**：
```
power_kw         float   # 即時功率（kW）
voltage          float   # 電壓（V）
current          float   # 電流（A）
power_factor     float   # 功率因數（可缺）
kwh_accum        float   # 累計用電量（kWh，電錶累計值）
freq_hz          float   # 頻率（Hz，可缺）
```

**採集週期**：每 5 分鐘

**保存策略**：同 `heatpump_status`，使用 `rp_raw`（365d）與 `rp_agg`（INF）

---

### 3.3 `system_health`（系統健康度彙總，可選）

**用途**：Node-RED 每 5 分鐘寫入，供設備總覽頁面快速讀取（避免即時計算全部設備狀態）

**標籤**：
```
site_id        = "SITE01"
```

**欄位**：
```
total_devices    integer  # 設備總數
normal_count     integer  # 正常台數
warning_count    integer  # 警告台數
fault_count      integer  # 異常台數
offline_count    integer  # 離線台數
```

**採集週期**：每 5 分鐘（由後端排程寫入，非設備直接上傳）

---

## 四、缺欄位處理策略

### 4.1 後端 API 處理原則

```typescript
// 缺欄位標準化函數（後端 data-transformer）
function normalizeDeviceData(raw: Record<string, unknown>) {
  return {
    temp_outlet:   raw.temp_outlet   ?? null,  // null 表示資料未提供
    pressure_high: raw.pressure_high ?? null,
    power_kw:      raw.power_kw      ?? null,
    error_code:    raw.error_code    ?? null,
    // ...其他欄位
  };
}
```

- 所有欄位在 API 回傳時明確為 `null`（不省略欄位）
- `null` 與 `0` 語義不同：`null` = 資料未提供；`0` = 正常零值

### 4.2 前端顯示策略

| 情況 | 顯示 |
|------|------|
| 欄位值為 `null` | 顯示 `--` |
| 欄位值為 `null`（趨勢圖） | 圖表中斷線（不連接缺失點） |
| 全部關鍵欄位均為 `null` | 顯示「資料未提供」badge |
| 資料源離線 | 顯示最後已知值 + 黃色「資料可能已過時」提示 |

### 4.3 API 回傳格式約定

```jsonc
{
  "device_id": "SITE01-001",
  "name": "設備 A",
  "current_status": "normal",
  "last_seen_at": "2026-05-23T10:00:00+08:00",
  "data": {
    "temp_outlet":   28.5,       // 正常值
    "pressure_high": null,       // 資料未提供（感測器未安裝）
    "power_kw":      12.3,
    "error_code":    0,
    "voltage_a":     null        // 資料未提供
  },
  "data_quality": {
    "available_fields": ["temp_outlet", "power_kw", "error_code"],
    "missing_fields":   ["pressure_high", "voltage_a"],
    "last_updated_at":  "2026-05-23T10:00:00+08:00"
  }
}
```

---

## 五、狀態機定義

### 設備狀態轉換規則（後端評定，每 5 分鐘更新）

```
                    ┌─────────────────────────────────┐
                    │         設備狀態評定流程           │
                    └─────────────────────────────────┘
                              ↓
              [上次資料時間距今 > 5 分鐘？]
              Yes → status = "offline"
              No  ↓
              [任一欄位超出危急門檻 OR error_code != 0？]
              Yes → status = "fault"
              No  ↓
              [任一欄位超出警戒門檻？]
              Yes → status = "warning"
              No  → status = "normal"
```

### 告警狀態轉換

```
open  →（維運人員確認）→  acknowledged  →（維運人員解決）→  resolved
```
- 只有 `open` 和 `acknowledged` 的告警顯示在「未處理」清單
- `resolved` 的告警顯示在「已解決」歷史清單
