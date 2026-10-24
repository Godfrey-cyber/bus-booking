import { pool } from "../db.js";
import bcrypt from "bcryptjs"

export const OperatorProfileModels = {
	async create(user) {
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
            conn.release();
        }
    }
}

// company_name, company_phone, slug, logo_url, user_id, company_email

export const OperatorProfileModel = {
    async create({ user_id, company_name, company_phone, company_email, slug }, conn) {
        const result = await conn.query(
            `INSERT INTO operator_profiles 
                (user_id, company_name, company_phone, company_email, slug)
             VALUES (?, ?, ?, ?, ?)`,
            [user_id, company_name, company_phone, company_email || null, slug || null]
        );

        return result;
    },

    updateStatus: async (operatorID, status) => {
        const conn = await pool.getConnection();
        try{
            const sql = `UPDATE operator_profiles SET status = ? WHERE id = ?`;
            const result = await pool.query(sql, [status, operatorID]);
            return result.affectedRows;
        } finally {
            conn.release();
        }
    },

    async getAll() {
        const conn = await pool.getConnection();
        try {
            return await conn.query("SELECT u.id, u.role_id, o.company_name, o.company_email, count(b.id) AS buses, o.rating_avg, o.created_at, o.status FROM users u INNER JOIN operator_profiles o ON u.id = o.user_id LEFT JOIN buses b ON u.id = b.operator_id WHERE u.role_id = 3 GROUP BY u.id, u.role_id, o.company_name, o.company_email, o.rating_avg, o.created_at, o.status ORDER BY o.created_at DESC LIMIT 10 OFFSET 1");
        } finally {
            conn.release();
        }
    }
};