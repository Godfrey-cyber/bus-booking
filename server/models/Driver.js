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
    },

    getOperatorDrivers: async(operatorID, { limit = 20, offset = 0 }) => {
        const dataSql = `
            SELECT 
                d.id,
                d.bus_id,
                d.name,
                d.operator_id,
                d.license_number,
                d.phone,
                b.plate_number,
                d.status,
                d.created_at
            FROM drivers d
            LEFT JOIN buses b ON d.operator_id = b.operator_id
            AND d.bus_id = b.id
            WHERE d.operator_id = ?
            ORDER BY d.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const countSql = `
            SELECT COUNT(*) AS total 
            FROM drivers 
            WHERE operator_id = ?
        `;

        // 1. Execute both queries concurrently
        const [dataResult, countResult] = await Promise.all([
            pool.query(dataSql, [Number(operatorID), Number(limit), Number(offset)]),
            pool.query(countSql, [Number(operatorID)])
        ]);

        // 2. Safely extract rows from Node.js database driver response
        const drivers = Array.isArray(dataResult[0]) ? dataResult[0] : dataResult;
        const totalRows = Array.isArray(countResult[0]) ? countResult[0] : countResult;
        const total = totalRows[0]?.total || 0;

        return {
            drivers,
            total
        };
    },
    async create({ name, license_number, phone, bus_id, operator_id }) {
        const conn = await pool.getConnection();
        try {
            const sql = `
                INSERT INTO drivers (
                    name, 
                    license_number, 
                    phone, 
                    bus_id,  
                    operator_id
                )
                VALUES (?, ?, ?, ?, ?)
            `;
            // Convert array to JSON string for MySQL storage
            // const formattedAmenities = JSON.stringify(amenities || []);

            const result = await conn.query(sql, [
                name,
                license_number.trim().toUpperCase(),
                phone.trim(),
                bus_id,
                // status || 'active',
                operator_id
            ]);

            console.log("result -model", result)

            return result;
        } finally {
            conn.release();
        }
    }
}