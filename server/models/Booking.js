import { pool } from "../db.js";

export const BookingModel = {
    async getAll() {
        const conn = await pool.getConnection();
        try {
            // return await conn.query("SELECT t.id AS schedule_id, o.name AS operator_name, o.id, o.rating_avg, b.plate_number, b.amenities, s.departure_time, s.arrival_time, b.id AS bus_id, b.model AS bus_name, r.id AS route_id, r.origin_id, r.destination_id, r.distance_km, r.duration_minutes, s.price, r.boarding_point, r.arrival_point FROM schedules s INNER JOIN routes r ON s.route_id = r.id INNER JOIN buses b ON s.bus_id = b.id JOIN operators o ON r.operator_id = o.id GROUP BY o.id");
            return await conn.query("SELECT b.id, b.created_at, b.booking_reference, b.status, u.first_name, r.boarding_point, r.arrival_point, b.passenger_count, o.name AS operator, t.trip_date, s.departure_time, s.arrival_time, b.total_amount, ss.bus_seat_id FROM bookings b INNER JOIN schedules s ON b.schedule_id = s.id INNER JOIN routes r ON s.route_id = r.id INNER JOIN trips t ON b.schedule_id = t.schedule_id INNER JOIN schedule_seats ss ON s.id = ss.schedule_id INNER JOIN users u ON b.user_id = u.id INNER JOIN operators o ON o.id = r.operator_id ORDER BY created_at ASC LIMIT 10");
            
        } finally {
            conn.release();
        }
    },

    async userBookings(bookingID) {
        const conn = await pool.getConnection();
        try {
            return await conn.query("SELECT b.id, b.created_at, b.booking_reference, b.status, r.boarding_point, r.arrival_point, b.passenger_count, t.trip_date, s.departure_time, s.arrival_time, b.total_amount, ss.bus_seat_id FROM bookings b INNER JOIN schedules s ON b.schedule_id = s.id INNER JOIN routes r ON s.route_id = r.id INNER JOIN trips t ON b.schedule_id = t.schedule_id INNER JOIN schedule_seats ss ON s.id = ss.schedule_id WHERE user_id = ? ORDER BY created_at ASC LIMIT 10", [bookingID]);
        } finally {
            conn.release();
        }
    },

    async getOne(bookingID) {
        const conn = await pool.getConnection();
        try {
            return await conn.query("SELECT * FROM bookings WHERE id = ?", [bookingID]);
        } finally {
            conn.release();
        }
    },

    async create(booking, transaction) {
        const executor = transaction || pool;
        try {
          const sql = `
            INSERT INTO bookings (
              trip_id, schedule_id, user_id, passenger_count, discount_amount,
              emergency_contact_name, emergency_contact_phone, subtotal,
              total_amount, promo_code_id, tax_amount, booking_reference
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          const values = [
            booking.trip_id,
            booking.schedule_id,
            booking.user_id,
            booking.passenger_count,
            booking.discount_amount,
            booking.emergency_contact_name,
            booking.emergency_contact_phone,
            booking.subtotal,
            booking.total_amount,
            booking.promo_code_id,
            booking.tax_amount,
            booking.booking_reference
          ];

          const [result] = await executor.query(sql, values);
          return result;
        } catch (error) {
          console.error("Error in BookingModel.create:", error);
          throw error;
        }
    }
};                