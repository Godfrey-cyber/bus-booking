import { pool } from "../db.js";
import bcrypt from "bcryptjs"

export const UserModel = {
	async create({ email, password, role_id }, conn) {
        
        // 1. Check if a user with this email already exists;
        const checkSql = `SELECT id FROM users WHERE email = ? LIMIT 1`;
        const existingUser = await conn.query(checkSql, [email]);

        if (existingUser.length > 0) {
            const error = new Error('A user with this email already exists.');
            error.code = 'ER_DUP_ENTRY';
            throw error;
        }

        // 2. Hash the password securely (salt rounds = 10)
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // 2. Insert core user (Column order must match parameter array!)
        const result = await conn.query(
            `INSERT INTO users (email, password, role_id) VALUES (?, ?, ?)`,
            [email, password_hash, role_id]
        );
        console.log("result", result)
        return result;
    },

    // async loginUser(user) {
    async findByEmail(email) {
        const conn = await pool.getConnection();
        try {
            const sql = `
            SELECT 
                u.id,
                u.email,
                u.password,
                u.role_id,
                u.status,
                -- Passenger Profile Fields
                p.first_name,
                p.last_name,
                p.phone AS passenger_phone,
                -- Operator Profile Fields
                o.company_name,
                o.company_phone,
                o.company_email,
                o.slug,
                o.logo_url,
                -- Role Fields
                r.name AS role
            FROM users u
            LEFT JOIN passenger_profiles p ON u.id = p.user_id
            LEFT JOIN operator_profiles o ON u.id = o.user_id
            LEFT JOIN roles r ON u.role_id = r.id
            WHERE u.email = ?
            LIMIT 1
        `;
        const rows = await conn.query(sql, [email]);
        return rows[0]; // Returns user object or undefined

        } finally {
            conn.release();
        }
    },

    async findById(id) {
        const conn = await pool.getConnection();
        const [rows] = await pool.query(
            'SELECT u.id, u.first_name, u.last_name, u.phone, u.email, u.status, u.password, u.role_id, r.name AS role FROM users u INNER JOIN roles r ON u.role_id = r.id WHERE u.id = ? LIMIT 1',
            [id]
        );
        return rows[0] ?? null;
    },

    async verifyPassword(plainPassword, passwordHash) {
        return await bcrypt.compare(plainPassword, passwordHash);
    },
    // },

    async getOne(userID) {
        const conn = await pool.getConnection();
        try {
            const row = await conn.query("SELECT u.id, u.first_name, u.last_name, u.phone, u.email, u.status, u.role_id, r.name AS role FROM users u INNER JOIN roles r ON u.role_id = r.id WHERE u.id = ? LIMIT 1", [userID]);
            return row[0] ?? null;
        } finally {
            conn.release();
        }
    },

    async editUser(userID, phone) {
        const conn = await pool.getConnection();
        try {
            return await conn.query("UPDATE users SET phone = ? WHERE id = ?", [phone, userID]);
        } finally {
            conn.release();
        }
    },

    // "SELECT o.id, o.name, o.contact_email, count(b.id) AS buses, o.rating_avg, o.created_at, o.status FROM operators o INNER JOIN buses b ON o.id = b.operator_id GROUP BY o.id"

    async getAll() {
        const conn = await pool.getConnection();
        try {
            // const selectSql = `
            //     SELECT id, first_name, last_name, phone, email FROM users ORDER BY first_name ASC LIMIT 20
            // `;

            const selectSql = `
                    SELECT 
                        u.id,
                        u.role_id,
                        o.company_name,
                        o.company_email,
                        o.status,
                        o.rating_avg,
                        o.created_at,
                        COUNT(b.id) AS buses
                    FROM users u 
                    INNER JOIN operator_profiles o ON u.id = o.user_id
                    LEFT JOIN buses b ON u.id = b.operator_id
                    WHERE role_id = 3
                    GROUP BY 
                        u.id,
                        u.role_id,
                        o.company_name,
                        o.company_email,
                        o.status,
                        o.rating_avg,
                        o.created_at
                    ORDER BY o.created_at DESC
                    LIMIT 20
            `; // count(b.id) AS buses

            return await conn.query(selectSql);

        } finally {
            conn.release();
        }
    }
}