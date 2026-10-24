import { pool } from "../db.js";
import { asyncHandler } from '../utilities/asyncHandler.js';

// GET /admin/operators — admin only — all operators.
export const listOperators = asyncHandler(async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM operators ORDER BY created_at DESC');
    res.status(200).json({ success: true, data: rows });
});

// PATCH /admin/operators/:id/suspend — admin only. No ownership check needed:
// admins act on every operator by definition, `authorize('admin')` is the
// entire guard here.
export const suspendOperator = asyncHandler(async (req, res) => {
    await pool.query('UPDATE operators SET status = "suspended" WHERE id = ?', [req.params.id]);
    res.status(200).json({ success: true, message: 'Operator suspended.' });
});
