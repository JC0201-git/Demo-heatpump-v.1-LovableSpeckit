# MySQL 資料模型

**所屬文件**：[data-model.md](./data-model.md)

---

## 1.1 `sites`（客戶場域）

```sql
CREATE TABLE sites (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  site_code   VARCHAR(20)  NOT NULL COMMENT '場域代碼，如：SITE01',
  name        VARCHAR(100) NOT NULL COMMENT '場域名稱',
  address     VARCHAR(255) NOT NULL DEFAULT '',
  contact     VARCHAR(100) NOT NULL DEFAULT '',
  phone       VARCHAR(30)  NOT NULL DEFAULT '',
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_site_code (site_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

種子資料：`SITE01` 拉拉手游泳學院、`SITE02` 洗衣廠、`SITE03` 罐頭工廠。

## 1.2 `heat_pumps`（熱泵設備主檔）

```sql
CREATE TABLE heat_pumps (
  id                    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  site_id               INT UNSIGNED NOT NULL COMMENT 'FK -> sites.id',
  device_id             VARCHAR(50)  NOT NULL COMMENT 'SITExx-xxx',
  name                  VARCHAR(100) NOT NULL,
  model                 VARCHAR(100) NOT NULL DEFAULT '',
  installed_at          DATE         NOT NULL,
  monitoring_started_at DATETIME     NOT NULL,
  monitoring_ended_at   DATETIME     NULL,
  is_mock               TINYINT(1)   NOT NULL DEFAULT 0,
  is_active             TINYINT(1)   NOT NULL DEFAULT 1,
  current_status        ENUM('normal','warning','fault','offline') NOT NULL DEFAULT 'offline',
  status_updated_at     DATETIME     NULL,
  notes                 TEXT         NULL,
  created_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_device_id (device_id),
  KEY idx_site_id (site_id),
  KEY idx_current_status (current_status),
  KEY idx_monitoring_window (monitoring_started_at, monitoring_ended_at),
  CONSTRAINT fk_hp_site FOREIGN KEY (site_id) REFERENCES sites(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

重點：`is_mock` 區分 3 台真實與 77 台模擬設備；`monitoring_started_at` 與 `monitoring_ended_at` 是月報分母依據。

## 1.3 `risk_assignments`（風險等級指派）

```sql
CREATE TABLE risk_assignments (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  heat_pump_id INT UNSIGNED NOT NULL,
  risk_level   ENUM('high','medium','low') NOT NULL,
  assigned_by  VARCHAR(100) NOT NULL DEFAULT 'operator',
  assigned_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes        TEXT         NULL,
  is_current   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_heat_pump_id (heat_pump_id),
  KEY idx_is_current (is_current),
  KEY idx_risk_level (risk_level),
  CONSTRAINT fk_ra_hp FOREIGN KEY (heat_pump_id) REFERENCES heat_pumps(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

每台設備只能有一筆 `is_current = 1`，由 API 在新增指派時關閉舊紀錄。

## 1.4 `alerts`（告警紀錄）

```sql
CREATE TABLE alerts (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  heat_pump_id     INT UNSIGNED NOT NULL,
  alert_type       ENUM('offline','error_code','threshold','manual') NOT NULL,
  severity         ENUM('critical','warning','info') NOT NULL DEFAULT 'warning',
  title            VARCHAR(200) NOT NULL,
  description      TEXT         NULL,
  error_code       VARCHAR(50)  NULL,
  triggered_at     DATETIME     NOT NULL,
  acknowledged_at  DATETIME     NULL,
  acknowledged_by  VARCHAR(100) NULL,
  resolved_at      DATETIME     NULL,
  resolved_by      VARCHAR(100) NULL,
  resolution_notes TEXT         NULL,
  status           ENUM('open','acknowledged','resolved') NOT NULL DEFAULT 'open',
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_heat_pump_id (heat_pump_id),
  KEY idx_status (status),
  KEY idx_alert_type (alert_type),
  KEY idx_severity (severity),
  CONSTRAINT fk_alert_hp FOREIGN KEY (heat_pump_id) REFERENCES heat_pumps(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 1.5 `maintenance_records`（保養紀錄）

```sql
CREATE TABLE maintenance_records (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  heat_pump_id     INT UNSIGNED NOT NULL,
  maintained_at    DATETIME     NOT NULL,
  technician       VARCHAR(100) NOT NULL DEFAULT '',
  maintenance_type VARCHAR(100) NOT NULL DEFAULT '',
  summary          TEXT         NOT NULL,
  parts_replaced   TEXT         NULL,
  next_scheduled   DATETIME     NULL,
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_heat_pump_id (heat_pump_id),
  KEY idx_maintained_at (maintained_at),
  CONSTRAINT fk_mr_hp FOREIGN KEY (heat_pump_id) REFERENCES heat_pumps(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 1.6 `monthly_reports`（月報紀錄）

```sql
CREATE TABLE monthly_reports (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  site_id         INT UNSIGNED NOT NULL,
  report_year     SMALLINT     NOT NULL,
  report_month    TINYINT      NOT NULL,
  generated_by    VARCHAR(100) NOT NULL DEFAULT 'manager',
  generated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  availability_pct DECIMAL(5,2) NOT NULL DEFAULT 0,
  total_alerts    INT          NOT NULL DEFAULT 0,
  critical_alerts INT          NOT NULL DEFAULT 0,
  summary_html    MEDIUMTEXT   NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_site_year_month (site_id, report_year, report_month),
  CONSTRAINT fk_monthly_site FOREIGN KEY (site_id) REFERENCES sites(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

同一場域同一月份採 UPSERT。此表是 manager 報表操作例外的唯一寫入目標。

## 1.7 `status_snapshots`（設備狀態快照）

```sql
CREATE TABLE status_snapshots (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  heat_pump_id INT UNSIGNED NOT NULL,
  snapshot_at  DATETIME     NOT NULL,
  status       ENUM('normal','warning','fault','offline') NOT NULL,
  source       VARCHAR(50)  NOT NULL DEFAULT 'statusUpdater',
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_hp_snapshot (heat_pump_id, snapshot_at),
  KEY idx_snapshot_at (snapshot_at),
  KEY idx_status (status),
  CONSTRAINT fk_ss_hp FOREIGN KEY (heat_pump_id) REFERENCES heat_pumps(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

`status_snapshots` 是月報可用率唯一歷史來源，不得以 `heat_pumps.current_status` 回推歷史。

---

## 關聯摘要

```text
sites 1--N heat_pumps
heat_pumps 1--N risk_assignments
heat_pumps 1--N alerts
heat_pumps 1--N maintenance_records
heat_pumps 1--N status_snapshots
sites 1--N monthly_reports
```
