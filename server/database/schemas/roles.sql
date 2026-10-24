CREATE TABLE roles (
    id int(11) NOT NULL AUTO_INCREMENT,
    name varchar(50) NOT NULL,
    description varchar(255) DEFAULT NULL,
    created_at timestamp NULL DEFAULT current_timestamp(),
    PRIMARY KEY (id),
    UNIQUE KEY name (name)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci