
CREATE TABLE users (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  role_id int(11) NOT NULL DEFAULT 2,
  -- first_name varchar(100) NOT NULL,
  -- last_name varchar(100) NOT NULL,
  email varchar(150) NOT NULL,
  -- phone varchar(20) DEFAULT NULL,
  password varchar(255) NOT NULL,
  is_verified tinyint(1) DEFAULT 0,
  status enum('ACTIVE','SUSPENDED','DELETED') DEFAULT 'ACTIVE',
  created_at timestamp NULL DEFAULT current_timestamp(),
  updated_at timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),

  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  KEY role_id (role_id),
  CONSTRAINT users_ibfk_1 FOREIGN KEY (role_id) REFERENCES roles (id)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci

-- 2. Passenger Specific Profile
CREATE TABLE IF NOT EXISTS passenger_profiles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    KEY role_id (user_id),
    CONSTRAINT fk_passenger_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci

-- CONSTRAINT users_ibfk_1 FOREIGN KEY (role_id) REFERENCES roles(id)

-- +----+---------+------------+-----------+
-- | id | role_id | first_name | last_name |
-- +----+---------+------------+-----------+
-- |  3 |       2 | David      | Mwangi    |
-- | 13 |       2 | Jane       | Doe       |
-- | 14 |       2 | Alpha      | Steve     |
-- | 16 |       3 | Steve      | Maina     |
-- | 17 |       2 | John       | Grunt     |
-- | 22 |       1 | Lewis      | Dan       |
-- | 28 |       1 | Godfrey    | Ndiritu   |
-- +----+---------+------------+-----------+

INSERT INTO passenger_profiles (user_id, first_name, last_name, phone) VALUES
(3, 'David', 'Mwangi', '+254712345678'),
(13, 'Jane', 'Doe', '+254723456789'),
(14, 'Alpha', 'Steve', '+254734567890'),
(17, 'John', 'Grunt', '+254745678901');