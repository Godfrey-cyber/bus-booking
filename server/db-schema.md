# FleetGo — Database Schema (MariaDB)

This maps directly onto the frontend you've built: `authApi` → `users`, `busesApi` → `buses`/`routes`/`schedules`, `bookingApi` → `bookings`/`payments`/`tickets`, the passenger dashboard → `saved_travelers`/`favorite_routes`/`notifications`, the operator dashboard → `drivers`/support for CRUD, and the upcoming admin dashboard → `refunds`/`support_tickets`/`audit_logs`.

Engine: **InnoDB** everywhere (foreign keys + transactions). Charset: **utf8mb4**. All tables get `created_at` / `updated_at`; a few get `deleted_at` for soft deletes where "undo" matters (bookings, buses, routes).

---

## 1. Domain map

| Domain | Tables |
|---|---|
| Identity & access | `users`, `operators`, `password_resets`, `refresh_tokens` |
| Fleet & network | `drivers`, `buses`, `bus_seats`, `locations`, `routes` |
| Scheduling & inventory | `schedules`, `schedule_seats` |
| Booking & payments | `bookings`, `booking_seats`, `payments`, `promo_codes` |
| Post-booking | `tickets`, `refunds`, `refund_events`, `reviews` |
| Engagement | `notifications`, `saved_travelers`, `favorite_routes` |
| Admin & ops | `support_tickets`, `support_ticket_replies`, `audit_logs` |

---

## 2. Identity & access

```sql
CREATE TABLE operators (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120)  NOT NULL,
  slug          VARCHAR(140)  NOT NULL UNIQUE,
  logo_url      VARCHAR(255),
  contact_email VARCHAR(190),
  contact_phone VARCHAR(30),
  rating_avg    DECIMAL(2,1)  NOT NULL DEFAULT 0.0,
  status        ENUM('active','suspended') NOT NULL DEFAULT 'active',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE users (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  operator_id     BIGINT UNSIGNED NULL,               -- set only for operator staff
  name            VARCHAR(120)  NOT NULL,
  email           VARCHAR(190)  NOT NULL UNIQUE,
  phone           VARCHAR(30),
  password_hash   VARCHAR(255)  NOT NULL,
  role            ENUM('passenger','operator_staff','admin') NOT NULL DEFAULT 'passenger',
  avatar_url      VARCHAR(255),
  status          ENUM('active','suspended','deleted') NOT NULL DEFAULT 'active',
  email_verified_at DATETIME NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_operator FOREIGN KEY (operator_id) REFERENCES operators(id) ON DELETE SET NULL,
  INDEX idx_users_role (role)
) ENGINE=InnoDB;

CREATE TABLE password_resets (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL,
  token_hash  VARCHAR(255) NOT NULL,
  expires_at  DATETIME NOT NULL,
  used_at     DATETIME NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pwreset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_pwreset_token (token_hash)
) ENGINE=InnoDB;

CREATE TABLE refresh_tokens (           -- backs "remember me" / JWT refresh
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NOT NULL,
  token_hash    VARCHAR(255) NOT NULL,
  user_agent    VARCHAR(255),
  ip_address    VARCHAR(45),
  expires_at    DATETIME NOT NULL,
  revoked_at    DATETIME NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_refresh_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_refresh_token (token_hash)
) ENGINE=InnoDB;
```

> `operator_staff` covers your Operator dashboard login; `admin` covers the Admin dashboard. A plain `passenger` row never has `operator_id` set.

---

## 3. Fleet & network

```sql
CREATE TABLE drivers (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  operator_id    BIGINT UNSIGNED NOT NULL,
  name           VARCHAR(120) NOT NULL,
  license_number VARCHAR(60)  NOT NULL,
  phone          VARCHAR(30),
  status         ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_drivers_operator FOREIGN KEY (operator_id) REFERENCES operators(id) ON DELETE CASCADE,
  UNIQUE KEY uq_driver_license (operator_id, license_number)
) ENGINE=InnoDB;

CREATE TABLE buses (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  operator_id    BIGINT UNSIGNED NOT NULL,
  plate_number   VARCHAR(20)  NOT NULL,
  model          VARCHAR(100) NOT NULL,
  capacity       SMALLINT UNSIGNED NOT NULL,
  amenities      JSON NULL,                 -- ["ac","wifi","charging",...]
  status         ENUM('active','maintenance','retired') NOT NULL DEFAULT 'active',
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at     DATETIME NULL,
  CONSTRAINT fk_buses_operator FOREIGN KEY (operator_id) REFERENCES operators(id) ON DELETE CASCADE,
  UNIQUE KEY uq_bus_plate (operator_id, plate_number)
) ENGINE=InnoDB;

-- Physical seat inventory per bus — the template your SeatMap component renders.
CREATE TABLE bus_seats (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  bus_id      BIGINT UNSIGNED NOT NULL,
  seat_number SMALLINT UNSIGNED NOT NULL,
  row_index   SMALLINT UNSIGNED NOT NULL,
  col_index   SMALLINT UNSIGNED NOT NULL,
  seat_type   ENUM('regular','vip','emergency_exit') NOT NULL DEFAULT 'regular',
  CONSTRAINT fk_busseats_bus FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
  UNIQUE KEY uq_bus_seat_number (bus_id, seat_number)
) ENGINE=InnoDB;

-- Normalized cities, reused by routes and the search form's origin/destination dropdowns.
CREATE TABLE locations (
  id        BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  city      VARCHAR(100) NOT NULL,
  country   VARCHAR(100) NOT NULL,
  latitude  DECIMAL(9,6),
  longitude DECIMAL(9,6),
  UNIQUE KEY uq_location_city (city, country)
) ENGINE=InnoDB;

CREATE TABLE routes (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  operator_id      BIGINT UNSIGNED NOT NULL,
  origin_id        BIGINT UNSIGNED NOT NULL,
  destination_id   BIGINT UNSIGNED NOT NULL,
  distance_km      SMALLINT UNSIGNED,
  duration_minutes SMALLINT UNSIGNED NOT NULL,
  base_price       DECIMAL(10,2) NOT NULL,
  boarding_point   VARCHAR(160),
  arrival_point    VARCHAR(160),
  status           ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at       DATETIME NULL,
  CONSTRAINT fk_routes_operator    FOREIGN KEY (operator_id)    REFERENCES operators(id) ON DELETE CASCADE,
  CONSTRAINT fk_routes_origin      FOREIGN KEY (origin_id)      REFERENCES locations(id),
  CONSTRAINT fk_routes_destination FOREIGN KEY (destination_id) REFERENCES locations(id),
  INDEX idx_routes_search (origin_id, destination_id)
) ENGINE=InnoDB;
```

---

## 4. Scheduling & seat inventory

A **schedule** is one bus departure on one route at one time — what your `busesApi.searchBuses` mock returns. **`schedule_seats`** is generated (one row per `bus_seats` row) when a schedule is created, and is the single source of truth your seat map and the 10-minute hold timer both read/write.

```sql
CREATE TABLE schedules (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  route_id        BIGINT UNSIGNED NOT NULL,
  bus_id          BIGINT UNSIGNED NOT NULL,
  driver_id       BIGINT UNSIGNED NULL,
  departure_time  DATETIME NOT NULL,
  arrival_time    DATETIME NOT NULL,
  price           DECIMAL(10,2) NOT NULL,     -- overrides route.base_price if operator adjusts fare
  status          ENUM('scheduled','departed','completed','cancelled') NOT NULL DEFAULT 'scheduled',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sched_route  FOREIGN KEY (route_id)  REFERENCES routes(id),
  CONSTRAINT fk_sched_bus    FOREIGN KEY (bus_id)    REFERENCES buses(id),
  CONSTRAINT fk_sched_driver FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL,
  INDEX idx_sched_departure (departure_time),
  INDEX idx_sched_route_time (route_id, departure_time)
) ENGINE=InnoDB;

CREATE TABLE schedule_seats (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  schedule_id      BIGINT UNSIGNED NOT NULL,
  bus_seat_id      BIGINT UNSIGNED NOT NULL,
  status           ENUM('available','held','booked') NOT NULL DEFAULT 'available',
  held_by_user_id  BIGINT UNSIGNED NULL,
  hold_expires_at  DATETIME NULL,               -- drives the seat-reservation countdown
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ss_schedule FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE,
  CONSTRAINT fk_ss_busseat  FOREIGN KEY (bus_seat_id) REFERENCES bus_seats(id),
  CONSTRAINT fk_ss_heldby   FOREIGN KEY (held_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY uq_schedule_seat (schedule_id, bus_seat_id),
  INDEX idx_ss_hold_expiry (hold_expires_at)
) ENGINE=InnoDB;
```

**Concurrency & seat-hold pattern:**
1. Selecting a seat → `UPDATE schedule_seats SET status='held', held_by_user_id=?, hold_expires_at=NOW()+INTERVAL 10 MINUTE WHERE id=? AND status='available'`. Zero affected rows = someone else got it first → tell the UI to refresh the map (this is the "concurrency" case from your spec).
2. A background job (or a check on every read) flips expired holds back to `available`.
3. Confirmed payment → `status='booked'` inside the same transaction as the booking/payment insert (see below).

---

## 5. Booking & payments

```sql
CREATE TABLE promo_codes (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code           VARCHAR(40) NOT NULL UNIQUE,
  description    VARCHAR(255),
  discount_type  ENUM('percent','fixed') NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  max_uses       INT UNSIGNED,
  used_count     INT UNSIGNED NOT NULL DEFAULT 0,
  valid_from     DATETIME NOT NULL,
  valid_until    DATETIME NOT NULL,
  status         ENUM('active','expired','disabled') NOT NULL DEFAULT 'active',
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE bookings (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_reference     CHAR(10) NOT NULL UNIQUE,      -- e.g. FG-8X29QK, shown on your BookingCard
  user_id               BIGINT UNSIGNED NOT NULL,
  schedule_id           BIGINT UNSIGNED NOT NULL,
  status                ENUM('pending','confirmed','cancelled','completed','refunded') NOT NULL DEFAULT 'pending',
  passenger_count       TINYINT UNSIGNED NOT NULL,
  subtotal              DECIMAL(10,2) NOT NULL,
  discount_amount       DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_amount            DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount          DECIMAL(10,2) NOT NULL,
  promo_code_id         BIGINT UNSIGNED NULL,
  emergency_contact_name  VARCHAR(120),
  emergency_contact_phone VARCHAR(30),
  cancellation_fee      DECIMAL(10,2) NULL,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at            DATETIME NULL,
  CONSTRAINT fk_bookings_user     FOREIGN KEY (user_id)     REFERENCES users(id),
  CONSTRAINT fk_bookings_schedule FOREIGN KEY (schedule_id) REFERENCES schedules(id),
  CONSTRAINT fk_bookings_promo    FOREIGN KEY (promo_code_id) REFERENCES promo_codes(id) ON DELETE SET NULL,
  INDEX idx_bookings_user_status (user_id, status)
) ENGINE=InnoDB;

-- One row per seat/passenger — mirrors your Checkout "passenger details per seat" step.
CREATE TABLE booking_seats (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id       BIGINT UNSIGNED NOT NULL,
  schedule_seat_id BIGINT UNSIGNED NOT NULL,
  passenger_name   VARCHAR(120) NOT NULL,
  passenger_age    TINYINT UNSIGNED,
  passenger_gender ENUM('male','female','other'),
  price            DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_bs_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_bs_seat    FOREIGN KEY (schedule_seat_id) REFERENCES schedule_seats(id),
  UNIQUE KEY uq_booking_seat (schedule_seat_id)   -- a seat can only belong to one active booking
) ENGINE=InnoDB;

CREATE TABLE payments (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id        BIGINT UNSIGNED NOT NULL,
  method            ENUM('mpesa','card','wallet','bank_transfer') NOT NULL,
  provider_reference VARCHAR(120),             -- Stripe/M-Pesa transaction id, for webhook reconciliation
  amount            DECIMAL(10,2) NOT NULL,
  currency          CHAR(3) NOT NULL DEFAULT 'KES',
  status            ENUM('pending','processing','success','failed','cancelled','refunded') NOT NULL DEFAULT 'pending',
  paid_at           DATETIME NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  INDEX idx_payments_provider_ref (provider_reference)
) ENGINE=InnoDB;
```

> Booking creation, seat status flip, and payment insert should happen in **one transaction** — that's the "seat reservation, booking, payment, ticket generation as a single backend transaction" requirement from your spec.

---

## 6. Post-booking (tickets, refunds, reviews)

```sql
CREATE TABLE tickets (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id    BIGINT UNSIGNED NOT NULL UNIQUE,
  qr_token      CHAR(36) NOT NULL UNIQUE,        -- UUID encoded into the QR code, not the booking_reference
  pdf_url       VARCHAR(255),
  issued_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  scanned_at    DATETIME NULL,                   -- set by the operator's Scan Tickets page
  scanned_by    BIGINT UNSIGNED NULL,
  CONSTRAINT fk_tickets_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_tickets_scanner FOREIGN KEY (scanned_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE refunds (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id      BIGINT UNSIGNED NOT NULL,
  requested_by    BIGINT UNSIGNED NOT NULL,
  reason          VARCHAR(255) NOT NULL,
  amount          DECIMAL(10,2) NOT NULL,
  status          ENUM('pending','approved','processing','completed','rejected') NOT NULL DEFAULT 'pending',
  processed_by    BIGINT UNSIGNED NULL,          -- admin who actioned it
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_refunds_booking FOREIGN KEY (booking_id) REFERENCES bookings(id),
  CONSTRAINT fk_refunds_requester FOREIGN KEY (requested_by) REFERENCES users(id),
  CONSTRAINT fk_refunds_processor FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Powers the refund timeline UI (pending → approved → processing → completed/rejected).
CREATE TABLE refund_events (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  refund_id   BIGINT UNSIGNED NOT NULL,
  status      ENUM('pending','approved','processing','completed','rejected') NOT NULL,
  note        VARCHAR(255),
  created_by  BIGINT UNSIGNED NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_refevents_refund FOREIGN KEY (refund_id) REFERENCES refunds(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE reviews (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id   BIGINT UNSIGNED NOT NULL UNIQUE,
  user_id      BIGINT UNSIGNED NOT NULL,
  operator_id  BIGINT UNSIGNED NOT NULL,
  rating       TINYINT UNSIGNED NOT NULL,        -- 1–5, feeds operators.rating_avg
  comment      VARCHAR(500),
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_booking  FOREIGN KEY (booking_id)  REFERENCES bookings(id),
  CONSTRAINT fk_reviews_user     FOREIGN KEY (user_id)     REFERENCES users(id),
  CONSTRAINT fk_reviews_operator FOREIGN KEY (operator_id) REFERENCES operators(id),
  CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB;
```

---

## 7. Engagement (passenger dashboard)

```sql
CREATE TABLE notifications (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL,
  type        ENUM('booking','reminder','refund','payment','operator','system') NOT NULL,
  title       VARCHAR(160) NOT NULL,
  message     VARCHAR(500) NOT NULL,
  read_at     DATETIME NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notif_user_unread (user_id, read_at)
) ENGINE=InnoDB;

CREATE TABLE saved_travelers (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL,
  name        VARCHAR(120) NOT NULL,
  age         TINYINT UNSIGNED,
  gender      ENUM('male','female','other'),
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_savedtrav_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE favorite_routes (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id        BIGINT UNSIGNED NOT NULL,
  origin_id      BIGINT UNSIGNED NOT NULL,
  destination_id BIGINT UNSIGNED NOT NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_favroutes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_favroutes_origin FOREIGN KEY (origin_id) REFERENCES locations(id),
  CONSTRAINT fk_favroutes_dest   FOREIGN KEY (destination_id) REFERENCES locations(id),
  UNIQUE KEY uq_fav_route (user_id, origin_id, destination_id)
) ENGINE=InnoDB;
```

---

## 8. Admin & ops (for phase 11)

```sql
CREATE TABLE support_tickets (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      BIGINT UNSIGNED NOT NULL,
  subject      VARCHAR(160) NOT NULL,
  status       ENUM('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
  priority     ENUM('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  assigned_to  BIGINT UNSIGNED NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_support_user     FOREIGN KEY (user_id)     REFERENCES users(id),
  CONSTRAINT fk_support_assignee FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE support_ticket_replies (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ticket_id   BIGINT UNSIGNED NOT NULL,
  user_id     BIGINT UNSIGNED NOT NULL,
  message     TEXT NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reply_ticket FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
  CONSTRAINT fk_reply_user   FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE audit_logs (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      BIGINT UNSIGNED NULL,             -- null = system action
  action       VARCHAR(80) NOT NULL,             -- e.g. 'booking.cancelled', 'operator.suspended'
  entity_type  VARCHAR(60) NOT NULL,
  entity_id    BIGINT UNSIGNED NOT NULL,
  meta         JSON NULL,
  ip_address   VARCHAR(45),
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_audit_entity (entity_type, entity_id)
) ENGINE=InnoDB;
```

---

## 9. Key design decisions

- **`schedule_seats` is the real inventory, not `buses.capacity`.** Every seat-map read/write, hold, and booking hits this table — it's what makes the 10-minute countdown and the "someone else booked your seat" concurrency case work correctly under load.
- **`UNIQUE (schedule_seat_id)` on `booking_seats`** is the actual guarantee against double-booking — a `SELECT ... FOR UPDATE` inside the booking transaction plus this constraint means MariaDB rejects a second booking on the same seat even under a race.
- **`booking_reference` (human-facing, e.g. `FG-8X29QK`) vs `tickets.qr_token` (UUID)** are deliberately different values — the reference is fine to show and search on, the QR token is what actually gets scanned so it can be rotated/invalidated without changing the booking record.
- **JSON `amenities` on `buses`** keeps that column flexible (ac/wifi/luxury/etc.) without a join table — fine since you only ever filter on a handful of known keys client-side, same as your `AMENITIES` mock constant.
- **Soft deletes** (`deleted_at`) on `buses`, `routes`, `bookings` — an operator retiring a bus or a passenger's booking history shouldn't vanish from historical reports.
- **`operators` is a company, `users.role='operator_staff'` is a seat on that company** — mirrors how a real operator dashboard usually has more than one staff login later, even though your demo only uses one.

## 10. Suggested indexes beyond the FKs above

```sql
ALTER TABLE bookings   ADD INDEX idx_bookings_reference (booking_reference);
ALTER TABLE schedules  ADD INDEX idx_schedules_status (status);
ALTER TABLE payments   ADD INDEX idx_payments_status (status);
ALTER TABLE refunds    ADD INDEX idx_refunds_status (status);
```

Route search (`origin_id`, `destination_id`, `departure_time`) is your hottest query path — the `idx_routes_search` and `idx_sched_route_time` composite indexes above cover it; add `EXPLAIN`-driven tuning once real query patterns show up.
