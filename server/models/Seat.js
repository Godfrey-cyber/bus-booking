import { pool } from "../db.js";

export const SeatModel = {
    async getAll() {
        const conn = await pool.getConnection();
        try {
            // return await conn.query("SELECT * FROM buses");
            return await conn.query("SELECT s.id AS seat_id, s.seat_number, bs.price AS price, s.row_index, s.col_index, s.seat_type, CASE WHEN bs.id IS NULL THEN 'available' ELSE 'booked' END AS seat_status FROM bus_seats s JOIN trips t ON t.bus_id = s.bus_id LEFT JOIN booking_seats bs ON bs.seat_id = s.id AND bs.trip_id = t.id WHERE t.id = 1 ORDER BY s.seat_number");
        } finally {
            conn.release();
        }
    },

    async getOne(seatID) {
        const conn = await pool.getConnection();
        try {
            return await conn.query("SELECT s.id AS seat_id, s.seat_number, CASE WHEN bs.id IS NULL THEN 'available' ELSE 'booked' END AS seat_status FROM bus_seats s JOIN trips t ON t.bus_id = s.bus_id LEFT JOIN booking_seats bs ON bs.seat_id = s.id AND bs.trip_id = t.id WHERE t.id = ? ORDER BY s.seat_number", [seatID])
        } finally {
            conn.release();
        }
    }
};