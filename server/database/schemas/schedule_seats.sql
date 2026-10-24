CREATE TABLE schedule_seats (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  schedule_id bigint(20) unsigned NOT NULL,
  bus_seat_id bigint(20) unsigned NOT NULL,
  status enum('available','held','booked') NOT NULL DEFAULT 'available',
  held_by_user_id bigint(20) DEFAULT NULL,
  hold_expires_at datetime DEFAULT NULL,
  created_at datetime NOT NULL DEFAULT current_timestamp(),
  updated_at datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),

  PRIMARY KEY (id),
  UNIQUE KEY uq_schedule_seat (schedule_id, bus_seat_id),
  KEY fk_ss_busseat (bus_seat_id),
  KEY fk_ss_heldby (held_by_user_id),
  KEY idx_ss_hold_expiry (hold_expires_at),

  CONSTRAINT fk_ss_busseat FOREIGN KEY (bus_seat_id) REFERENCES bus_seats (id),
  CONSTRAINT fk_ss_heldby FOREIGN KEY (held_by_user_id) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT fk_ss_schedule FOREIGN KEY (schedule_id) REFERENCES schedules (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci