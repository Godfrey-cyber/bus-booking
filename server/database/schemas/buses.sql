CREATE TABLE buses (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  operator_id bigint(20) unsigned NOT NULL,
  plate_number varchar(20) NOT NULL,
  model varchar(100) NOT NULL,
  capacity smallint(5) unsigned NOT NULL,
  amenities longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(amenities)),
  status enum('active','maintenance','retired') NOT NULL DEFAULT 'active',
  created_at datetime NOT NULL DEFAULT current_timestamp(),
  updated_at datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  deleted_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_bus_plate (operator_id, plate_number),
  CONSTRAINT fk_buses_operator FOREIGN KEY (operator_id) REFERENCES operators (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci