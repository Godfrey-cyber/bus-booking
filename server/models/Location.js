import { pool } from "../db.js";

export const LocationModel = {
    async getAll() {
        const conn = await pool.getConnection();
        try {
            return await conn.query("SELECT * FROM locations");
            // return await conn.query("SELECT c.id, c.first_name, c.last_name, o.amount, c.country FROM Customers c INNER JOIN Orders o ON c.id = o.user_id GROUP BY c.id, c.first_name, c.last_name, o.amount, c.country");
        } finally {
            conn.release();
        }
    },

    async getOne(locationID) {
        const conn = await pool.getConnection();
        try {
            return await conn.query("SELECT * FROM locations WHERE id = ?", [locationID]);
        } finally {
            conn.release();
        }
    },

    async create(location) {
        const conn = await pool.getConnection();
        try {
            const sql = `
                INSERT INTO locations (item, amount, user_id)
                VALUES (?, ?, ?)
            `;
            return await conn.query(sql, Object.values(location));
        } finally {
            conn.release();
        }
    }
};