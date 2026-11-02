import { pool } from '../db.js';

export const ScheduleModel = {
  /**
   * Create a new route
   */
  create: async ({ operator_id, route_id, departure_time, arrival_time, price, bus_id, reccurence_type, status }) => {
    const sql = `
        INSERT INTO schedules (
            operator_id,
	        route_id,
	        departure_time,
	        arrival_time,
	        price,
	        bus_id, 
	        reccurence_type,
	        status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
        operator_id,
        route_id,
        departure_time,
        arrival_time,
        price,
        bus_id, 
        reccurence_type,
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
	    SELECT
		    s.id,
		    s.operator_id,
		    s.route_id,
	        s.departure_time,
	        s.arrival_time,
	        s.price,
	        s.bus_id, 
	        s.reccurence_type,
	        s.status,
	        b.plate_number
	    FROM schedules s
	    INNER JOIN buses b
	    ON s.bus_id = b.id
        WHERE s.operator_id = ? 
        ORDER BY id DESC 
        LIMIT ? 
        OFFSET ?
    ;`

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
      SELECT * FROM schedules 
      WHERE id = ? AND operator_id = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(sql, [id, operatorId]);
    return rows[0] || null;
  }
};