import { pool } from "../db.js";

export const BusModel = {
    async getAll() {
        const conn = await pool.getConnection();
        try {
            // return await conn.query("SELECT * FROM buses");
            return await conn.query("SELECT s.id AS schedule_id, o.name AS operator_name, o.id, o.rating_avg, b.plate_number, b.amenities, s.departure_time, s.arrival_time, b.id AS bus_id, b.model AS bus_name, r.id AS route_id, r.origin_id, r.destination_id, r.distance_km, r.duration_minutes, s.price, r.boarding_point, r.arrival_point FROM schedules s INNER JOIN routes r ON s.route_id = r.id INNER JOIN buses b ON s.bus_id = b.id JOIN operators o ON r.operator_id = o.id GROUP BY o.id");
        } finally {
            conn.release();
        }
    },

    async getOne(busID) {
        const conn = await pool.getConnection();
        try {
            return await conn.query("SELECT s.id AS schedule_id, ss.hold_expires_at, o.name AS operator_name, o.id, o.rating_avg, b.plate_number, b.amenities, s.departure_time, s.arrival_time, b.id AS bus_id, b.model AS bus_name, r.id AS route_id, r.origin_id, r.destination_id, r.distance_km, r.duration_minutes, s.price, r.boarding_point, r.arrival_point FROM schedules s INNER JOIN routes r ON s.route_id = r.id INNER JOIN buses b ON s.bus_id = b.id JOIN operators o ON r.operator_id = o.id JOIN schedule_seats ss ON schedule_id = ss.schedule_id WHERE b.id = ? GROUP BY o.id", [busID])
        } finally {
            conn.release();
        }
    },

    // getOperatorBuses
    
    getOperatorBuses: async (operatorID, { limit = 20, offset = 0 }) => {
        const dataSql = `
            SELECT 
                b.id,
                b.plate_number,
                d.name,
                b.model,
                b.capacity,
                b.status,
                b.operator_id,
                b.created_at
            FROM buses b
            LEFT JOIN drivers d ON
            b.operator_id = d.operator_id
            AND b.id = d.bus_id
            WHERE b.operator_id = ?
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `;

        const countSql = `
            SELECT COUNT(*) AS total 
            FROM buses 
            WHERE operator_id = ?
        `;

        // 1. Await both query promises
        const [dataResult, countResult] = await Promise.all([
            pool.query(dataSql, [operatorID, Number(limit), Number(offset)]),
            pool.query(countSql, [operatorID]),
        ]);

        // 2. Safely extract rows (mysql2 returns [rows, fields])
        const rows = Array.isArray(dataResult[0]) ? dataResult[0] : dataResult;
        const totalRows = Array.isArray(countResult[0]) ? countResult[0] : countResult;

        // 3. Parse amenities safely
        const buses = (rows || []).map((bus) => ({
            ...bus,
            amenities: typeof bus.amenities === 'string' 
                ? JSON.parse(bus.amenities || '[]') 
                : (bus.amenities || []),
        }));

        return {
            buses,
            total: totalRows[0]?.total || 0,
        };
    },

    getByIdWithSeats: async (operatorID, busID) => {
        const dataSql = `
            SELECT 
                b.id,
                b.plate_number,
                d.name,
                b.model,
                b.capacity,
                b.status,
                b.operator_id,
                b.created_at
            FROM buses b
            LEFT JOIN drivers d ON
            b.operator_id = d.operator_id
            AND b.id = d.bus_id
            WHERE b.operator_id = ? AND b.id = ?
        `;

        const countSql = `
            SELECT COUNT(*) AS total 
            FROM buses 
            WHERE operator_id = ?
        `;

        // 1. Await both query promises
        const [dataResult, countResult] = await Promise.all([
            pool.query(dataSql, [operatorID, busID]),
            pool.query(countSql, [operatorID]),
        ]);

        // 2. Safely extract rows (mysql2 returns [rows, fields])
        const rows = Array.isArray(dataResult[0]) ? dataResult[0] : dataResult;
        const totalRows = Array.isArray(countResult[0]) ? countResult[0] : countResult;

        // 3. Parse amenities safely
        const buses = (rows || []).map((bus) => ({
            ...bus,
            amenities: typeof bus.amenities === 'string' 
                ? JSON.parse(bus.amenities || '[]') 
                : (bus.amenities || []),
        }));

        return {
            buses,
            total: totalRows[0]?.total || 0,
        };
    },

    async create({ plate_number, model, capacity, amenities, status, operator_id }) {
        const conn = await pool.getConnection();
        try {
            const sql = `
                INSERT INTO buses (
                    plate_number, 
                    model, 
                    capacity, 
                    amenities, 
                    status, 
                    operator_id
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            // Convert array to JSON string for MySQL storage
            const formattedAmenities = JSON.stringify(amenities || []);

            const result = await conn.query(sql, [
                plate_number.trim().toUpperCase(),
                model.trim(),
                Number(capacity),
                formattedAmenities,
                status || 'active',
                operator_id
            ]);

            return result;
        } finally {
            conn.release();
        }
    },

    /**
   * Checks if a plate number already exists for a given operator
   */
    async findByPlateAndOperator(plate_number, operator_id) {
        const conn = await pool.getConnection();
        const sql = `
            SELECT 
                id 
            FROM buses 
            WHERE operator_id = ? AND plate_number = ? AND deleted_at IS NULL 
            LIMIT 1
        `;
        const rows = await conn.query(sql, [operator_id, plate_number.trim().toUpperCase()]);
        return rows[0] || null;
    },
};