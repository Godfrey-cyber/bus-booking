CREATE TABLE drivers (
    id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    operator_id bigint(20) unsigned NOT NULL,
    name varchar(120) NOT NULL,
    license_number varchar(60) NOT NULL,
    phone varchar(30) DEFAULT NULL,
    status enum('active','inactive') NOT NULL DEFAULT 'active',
    created_at datetime NOT NULL DEFAULT current_timestamp(),
    updated_at datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (id),
    UNIQUE KEY uq_driver_license (operator_id, license_number),
    CONSTRAINT fk_drivers_operator FOREIGN KEY (operator_id) REFERENCES operators (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci