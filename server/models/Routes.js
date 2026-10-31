import { pool } from '../db.js';

export const RouteModel = {
  /**
   * Create a new route
   */
  create: async ({ operator_id, origin_id, destination_id, boarding_point, arrival_point, distance_km, duration_minutes, status }) => {
    const sql = `
        INSERT INTO routes (
            operator_id,
            origin_id, 
            destination_id, 
            boarding_point, 
            arrival_point, 
            distance_km, 
            duration_minutes, 
            status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
        operator_id, 
        origin_id, //: Number(origin_id),
        destination_id, // : Number(destination_id), 
        boarding_point.trim(), 
        arrival_point.trim(), 
        distance_km,//: Number(distance), 
        duration_minutes, //: Number(duration), 
        status
    ];

    const result = await pool.query(sql, params);
    return result;
  },

  /**
   * Fetch paginated list of routes belonging to an operator
   */
  getByOperatorId: async (operatorId, { limit = 20, offset = 0 }) => {
    const sql = `
	    SELECT r.id AS 
        route_id,
        r.operator_id, 
        orig.city AS origin_city, 
        orig.country AS origin_country, 
        dest.city AS location_city, 
        dest.country AS location_country, 
        r.distance_km, 
        r.duration_minutes  
        FROM routes r
        INNER JOIN 
        locations orig 
        ON r.origin_id = orig.id 
        INNER JOIN locations dest 
        ON r.destination_id = dest.id
        WHERE r.operator_id = ? 
        ORDER BY r.id 
        DESC LIMIT ? 
        OFFSET ?`

    const countSql = `
      SELECT COUNT(*) AS total 
      FROM routes 
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
      SELECT * FROM routes 
      WHERE id = ? AND operator_id = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(sql, [id, operatorId]);
    return rows[0] || null;
  }
};