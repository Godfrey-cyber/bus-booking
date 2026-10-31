import { pool } from '../db.js';

export const DestinationModel = {
  /**
   * Create a new destination
   */
  create: async ({ operator_id, city, country, latitude, longitude, image }) => {
    const sql = `
        INSERT INTO locations (
            operator_id, 
            city, 
            country, 
            latitude, 
            longitude, 
            image
        ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
        operator_id,
        city.trim(),
        country.trim(),
        latitude,
        longitude,
        image || null
    ];

    const result = await pool.query(sql, params);
    return result;
  },

  /**
   * Fetch paginated list of destinations belonging to an operator
   */
  getByOperatorId: async (operatorId, { limit = 20, offset = 0 }) => {
    const sql = `
      SELECT 
        id,
        operator_id,
        city,
        country,
        latitude,
        longitude,
        image
      FROM locations
      WHERE operator_id = ?
      ORDER BY country DESC
      LIMIT ? OFFSET ?
    `;

    const countSql = `
      SELECT COUNT(*) AS total 
      FROM locations 
      WHERE operator_id = ?
    `;

    const rows = await pool.query(sql, [operatorId, Number(limit), Number(offset)]);
    const [countResult] = await pool.query(countSql, [operatorId]);

    return {
      data: rows,
      total: countResult[0]?.total || 0
    };
  },

  /**
   * Fetch a single destination by ID and operator ID
   */
  getByIdAndOperator: async (id, operatorId) => {
    const sql = `
      SELECT * FROM locations 
      WHERE id = ? AND operator_id = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(sql, [id, operatorId]);
    return rows[0] || null;
  }
};