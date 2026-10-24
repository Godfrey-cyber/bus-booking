import { pool } from "../db.js";

export const DriverModel = {
    async getAll() {
        const conn = await pool.getConnection();
        try {
            // return await conn.query("SELECT * FROM drivers");
            return await conn.query("SELECT * FROM drivers WHERE status = 'ACTIVE' ");
        } finally {
            conn.release();
        }
    },

    async getOne(busID) {
        const conn = await pool.getConnection();
        try {
            return await conn.query("SELECT * FROM drivers WHERE id = ?", [busID])
        } finally {
            conn.release();
        }
    }
}