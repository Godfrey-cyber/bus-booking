CREATE TABLE bus_seats (
    id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    bus_id bigint(20) unsigned NOT NULL,
    seat_number smallint(5) unsigned NOT NULL,
    row_index smallint(5) unsigned NOT NULL,
    col_index smallint(5) unsigned NOT NULL,
    seat_type enum('regular','vip','emergency_exit') NOT NULL DEFAULT 'regular',
    
    PRIMARY KEY (id),
    UNIQUE KEY uq_bus_seat_number (bus_id,seat_number),
    CONSTRAINT fk_busseats_bus FOREIGN KEY (bus_id) REFERENCES buses (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=483 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci