CREATE TABLE locations (
    id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    city varchar(100) NOT NULL,
    country varchar(100) NOT NULL,
    latitude decimal(9,6) DEFAULT NULL,
    longitude decimal(9,6) DEFAULT NULL,
    image varchar(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_location_city (city,country)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci