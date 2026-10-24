CREATE TABLE promo_codes (
    id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    operator_id bigint(20) unsigned NOT NULL,
    code varchar(40) NOT NULL,
    description varchar(255) DEFAULT NULL,
    discount_type enum('percent','fixed') NOT NULL,
    discount_value decimal(10,2) NOT NULL,
    max_uses int(10) unsigned DEFAULT NULL,
    used_count int(10) unsigned NOT NULL DEFAULT 0,
    valid_from datetime NOT NULL,
    valid_until datetime NOT NULL,
    status enum('active','expired','disabled') NOT NULL DEFAULT 'active',
    created_at datetime NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (id),
    UNIQUE KEY code (code, operator_id),
    CONSTRAINT fk_operator_id FOREIGN KEY (operator_id) REFERENCES operators (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci