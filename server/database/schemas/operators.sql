CREATE TABLE operators (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  name varchar(120) NOT NULL,
  slug varchar(140) NOT NULL,
  logo_url varchar(255) DEFAULT NULL,
  contact_email varchar(190) DEFAULT NULL,
  contact_phone varchar(30) DEFAULT NULL,
  rating_avg decimal(2,1) NOT NULL DEFAULT 0.0,
  status enum('active','suspended') NOT NULL DEFAULT 'active',
  created_at datetime NOT NULL DEFAULT current_timestamp(),
  updated_at datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY slug (slug)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci

-- UPDATE operator_profiles MODIFY COLUMN user_id BIGINT NOT NULL;