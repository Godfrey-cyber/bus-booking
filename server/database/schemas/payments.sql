CREATE TABLE payments (
    id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    booking_id bigint(20) unsigned NOT NULL,
    method enum('mpesa','card','wallet','bank_transfer') NOT NULL,
    provider_reference varchar(120) DEFAULT NULL,
    amount decimal(10,2) NOT NULL,
    currency char(3) NOT NULL DEFAULT 'KES',
    status enum('pending','processing','success','failed','cancelled','refunded') NOT NULL DEFAULT 'pending',
    paid_at datetime DEFAULT NULL,
    created_at datetime NOT NULL DEFAULT current_timestamp(),
    updated_at datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (id),
    KEY fk_payments_booking (booking_id),
    KEY idx_payments_provider_ref (provider_reference),
    CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci