import { pool } from "../db.js";

export const PaymentModel = {
    async getAll() {
        const conn = await pool.getConnection();
        try {
            // return await conn.query("SELECT * FROM payments");
            return await conn.query("SELECT p.id, b.booking_reference, p.method, p.amount, p.paid_at, p.status FROM payments p INNER JOIN bookings b on p.booking_id = b.id");
        } finally {
            conn.release();
        }
    },

    async getOne(paymentID) {
        const conn = await pool.getConnection();
        try {
            return await conn.query("SELECT p.id, b.booking_reference, p.method, p.amount, p.paid_at, p.status FROM payments p INNER JOIN bookings b on p.booking_id = b.id WHERE p.id = ? GROUP BY o.id", [paymentID])
        } finally {
            conn.release();
        }
    },

    async create(payment) {
        const conn = await pool.getConnection();
        try {
            const sql = `
                INSERT INTO payments (booking_id, method, provider_reference, method, currency, status)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            return await conn.query(sql, Object.values(payment));
        } finally {
            conn.release();
        }
    }
};