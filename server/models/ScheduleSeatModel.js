import { pool } from "../db.js";

export const ScheduleSeatModel = {
    createSeatsForTrip: async ({ schedule_id, bus_id }, transaction) => {
        const executor = transaction || pool;

        // 1. Get all physical seats for the assigned bus
        const rawSeats = await executor.query(
          `SELECT id FROM bus_seats WHERE bus_id = ?`,
          [bus_id]
        );
        const busSeats = Array.isArray(rawSeats[0]) ? rawSeats[0] : rawSeats;
        console.log("busSeats:", busSeats)

        if (!busSeats || busSeats.length === 0) {
          throw new Error("No physical seats found for this bus layout.");
        }

        // 2. Format bulk insertion payload
        // Array format: [trip_id, schedule_id, seat_id, status, price]
        const scheduleSeatsData = busSeats.map((seat) => [
            schedule_id,
            seat.id,
            "available"
        ]);

        // console.log("scheduleSeatsData", scheduleSeatsData)

        const sql = `
            INSERT INTO schedule_seats (
                schedule_id,
                bus_seat_id,
                status
            ) VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE status = VALUES(status);
        `;

        // 3. Execute bulk insert
        // return await executor.query(sql, [scheduleSeatsData]);
        return await executor.batch(sql, scheduleSeatsData);
    },

    getBookedSeats: async (scheduleSeatIds, transaction) => {
        // Ensure scheduleSeatIds is an array
        const ids = Array.isArray(scheduleSeatIds) ? scheduleSeatIds : [scheduleSeatIds];
        
        if (ids.length === 0) return [];

        const [rows] = await transaction.query(
            `SELECT id, status, held_by_user_id, hold_expires_at 
             FROM schedule_seats 
             WHERE id IN (?) FOR UPDATE`,
            [ids]
        );
        return rows;
    },

    makeScheduleBooked: async (scheduleSeatIds, transaction) => {
        const ids = Array.isArray(scheduleSeatIds) ? scheduleSeatIds : [scheduleSeatIds];

        if (ids.length === 0) return;

        const [result] = await transaction.query(
            `UPDATE schedule_seats 
             SET status = 'booked', held_by_user_id = NULL, hold_expires_at = NULL 
             WHERE id IN (?)`,
            [ids]
        );
        return result;
    },

    async getAll() {
        const conn = await pool.getConnection();
        try {
            // return await conn.query("SELECT * FROM buses");
            return await conn.query("SELECT s.id AS seat_id, s.seat_number, bs.price AS price, s.row_index, s.col_index, s.seat_type, CASE WHEN bs.id IS NULL THEN 'available' ELSE 'booked' END AS seat_status FROM bus_seats s JOIN trips t ON t.bus_id = s.bus_id LEFT JOIN booking_seats bs ON bs.seat_id = s.id AND bs.trip_id = t.id WHERE t.id = 1 ORDER BY s.seat_number");
        } finally {
            conn.release();
        }
    },

    async getTripSeats(tripID, busID) {
        const conn = await pool.getConnection();
        try {
            const sql = `
                SELECT 
                    bs.id AS bus_seat_id,
                    bs.bus_id,
                    bs.seat_number,
                    bs.seat_type,
                    bs.row_index,
                    bs.col_index,
                    ss.id AS schedule_seat_id,
                    ss.schedule_id,
                    ss.trip_id,
                    COALESCE(ss.status, 'available') AS status,
                    ss.held_by_user_id,
                    ss.hold_expires_at
                FROM bus_seats bs
                INNER JOIN schedule_seats ss 
                    ON bs.id = ss.bus_seat_id
                WHERE ss.trip_id = ? AND bs.bus_id = ?
            `;
            return await conn.query(sql, [tripID, busID])
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
    },

    getBySeatNumbers: async (busID, tripID, seatNumbers, transaction) => {
        if (!seatNumbers || seatNumbers.length === 0) return [];

        // const stringSeatNumbers = seatNumbers.map((s) => String(s));

        const executor = transaction || pool;
        const formattedSeatNumbers = seatNumbers.map(num => Number(num));
        const placeholders = formattedSeatNumbers.map(() => "?").join(", ");

        const sql = `
            SELECT 
                bs.id AS bus_seat_id,
                bs.bus_id,
                bs.seat_number,
                bs.seat_type,
                bs.row_index,
                bs.col_index,
                ss.id AS schedule_seat_id,
                ss.schedule_id,
                ss.trip_id,
                COALESCE(ss.status, 'available') AS status,
                ss.held_by_user_id,
                ss.hold_expires_at
            FROM bus_seats bs
            INNER JOIN schedule_seats ss 
                ON bs.id = ss.bus_seat_id
            WHERE bs.bus_id = ? AND ss.trip_id = ?
            AND bs.seat_number IN (${placeholders})
        `;

        // const params = [busID, ...seatNumbers];
        const params = [busID, tripID, ...formattedSeatNumbers];

        // FIX: Destructure [rows] because mysql2 returns [rows, fields]
        const [rows] = await executor.query(sql, params);

        console.log(pool, transaction)

        console.log("rows", rows)
        console.log("params", params)

        if (!rows) return [];
        return Array.isArray(rows) ? rows : [rows];
    }
};

            // SELECT 
            //     bs.id AS bus_seat_id,
            //     bs.bus_id,
            //     bs.seat_number,
            //     bs.seat_type,
            //     bs.row_index,
            //     bs.col_index,
            //     ss.id AS schedule_seat_id,
            //     ss.schedule_id,
            //     ss.trip_id,
            //     COALESCE(ss.status, 'available') AS status,
            //     ss.held_by_user_id,
            //     ss.hold_expires_at
            // FROM bus_seats bs
            // INNER JOIN schedule_seats ss 
            //     ON bs.id = ss.bus_seat_id
            // WHERE bs.bus_id = 4 AND ss.trip_id = 52
            // AND bs.seat_number IN (55, 54);