import { pool } from "../db.js";
import bcrypt from "bcryptjs"

export const PassengerProfileModels = {
	async create() {
        const conn = await pool.getConnection();
        try {
            const { company_email, company_phone, slug, logo_url, user_id } = user;
            // 1. Check if a user with this email already exists;
            const checkSql = `SELECT id FROM users WHERE company_email = ? LIMIT 1`;
            const existingUser = await conn.query(checkSql, [company_email]);

            if (existingUser.length > 0) {
              throw new Error('A user with this email already exists.');
            }

            // 2. Hash the password securely (salt rounds = 10)
            const saltRounds = 10;
            const password_hash = await bcrypt.hash(password, saltRounds);

            // 3. Insert the new user.
            const insertSql = `
                INSERT INTO users (company_name, company_phone, slug, logo_url, user_id)
                VALUES (?, ?, ?, ?, ?)
            `;

            const result = await conn.query(insertSql, [
                company_name,
                company_phone,
                slug,
                logo_url,
                user_id
            ]);

            // Return the inserted user ID along with non-sensitive data
            return {
                id: Number(result.insertId),
                company_name,
                company_phone,
                slug,
                logo_url,
                user_id
            };
        } finally {
            conn.release(); // fisrt_name
        }
    }
}

// company_name, company_phone, slug, logo_url, user_id, company_email

export const PassengerProfileModel = {
    async create({ user_id, first_name, last_name, phone }, conn) {
        const result = await conn.query(
            `INSERT INTO passenger_profiles 
                (user_id, first_name, last_name, phone)
             VALUES (?, ?, ?, ?)`,
            [user_id, first_name, last_name, phone]
        );

        return result;
    }
};