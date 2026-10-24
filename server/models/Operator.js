import { pool } from "../db.js";

export const OperatorModel = {
    async getAll() {
        const conn = await pool.getConnection();
        try {
            // return await conn.query("SELECT * FROM buses");
            return await conn.query("SELECT u.id, u.role_id, o.company_name, o.company_email, count(b.id) AS buses, o.rating_avg, o.created_at, o.status FROM operator_profiles o INNER JOIN users u ON u.id = o.user_id LEFT JOIN buses b ON u.id = b.operator_id WHERE u.role_id = 3 GROUP BY u.id, u.role_id, o.company_name, o.company_email, o.rating_avg, o.created_at, o.status ORDER BY o.created_at DESC LIMIT 10 OFFSET 1");
        } finally {
            conn.release();
        }
    },

    async getOne(id) {
        const conn = await pool.getConnection();
        try {
            const row = await conn.query("SELECT o.id, o.name, o.contact_email, o.slug, o.status, r.name AS role FROM operators o INNER JOIN roles r ON o.id = r.id WHERE o.id = ? LIMIT 1", [id]);
            return row[0] ?? [];
        } finally {
            conn.release();
        }
    },

    updateStatus: async (operatorID, status) => {
        const conn = await pool.getConnection();
        try{
            const sql = `UPDATE operators SET status = ? WHERE id = ?`;
            const result = await pool.query(sql, [status, operatorID]);
            return result.affectedRows;
        } finally {
            conn.release();
        }
    },

    async findById(id) {
        const conn = await pool.getConnection();
        try {
            const sql = `
                SELECT 
                    id,
                    name,
                    contact_email AS email,
                    contact_phone,
                    status,
                    logo_url,
                    slug
                FROM operators
                WHERE id = ?
                LIMIT 1
            `;
            const rows = await conn.query(sql, [id]);
            return rows[0] || null; // Returns user object or undefined

        } finally {
            conn.release();
        }
    },

    async create({ name, contact_email, slug, logo_url, contact_phone }) {
        const conn = await pool.getConnection();
        try {
            const sql = `
                INSERT INTO operators (name, contact_email, slug, logo_url, contact_phone)
                VALUES (?, ?, ?, ?, ?)
                `;
                const params = [
                    name,
                    // status,
                    contact_email,
                    slug,          // 4th position
                    logo_url,      // 5th position
                    contact_phone, // 6th position
                    // rating_avg
                ];

            return await conn.query(sql, params);
        } finally {
            conn.release();
        }
    }
};

// select s.id AS schedule_id, r.arrival_point, b.plate_number, d.name AS driver_name, s.departure_time, s.pri
// ce, s.status from schedules s INNER JOIN routes r ON s.route_id = r.id INNER JOIN buses b ON s.bus_id = b.id INNER JOIN drivers
 // d ON s.driver_id = d.id;