import { pool } from "../db.js";

// export const BusSeatModel = {
//     getBySeatNumbers: async (busID, seatNumbers, transaction) => {
//         if (!seatNumbers || seatNumbers.length === 0) return [];

//         const executor = transaction || pool;

//         const placeholders = seatNumbers.map(() => '?').join(', ');

//         const sql = `
//             SELECT
//               id,
//               bus_id,
//               seat_number,
//               seat_type,
//               row_index,
//               col_index
//             FROM bus_seats
//             WHERE bus_id = ?
//               AND seat_number IN (${placeholders})
//         `;

//         const params = [busID, ...seatNumbers];
        
//         const rows = await executor.query(sql, params);

//         return rows;
//     }
// };



export const BusSeatModel = {
    getBySeatNumbers: async (busID, seatNumbers, transaction) => {
        if (!seatNumbers || seatNumbers.length === 0) return [];

        // const stringSeatNumbers = seatNumbers.map((s) => String(s));

        const executor = transaction || pool;
        const formattedSeatNumbers = seatNumbers.map(num => Number(num));
        const placeholders = formattedSeatNumbers.map(() => "?").join(", ");

        const sql = `
            SELECT
                id,
                bus_id,
                seat_number,
                seat_type,
                row_index,
                col_index
            FROM bus_seats
            WHERE bus_id = ?
            AND seat_number IN (${placeholders})
        `;

        // const params = [busID, ...seatNumbers];
        const params = [busID, ...formattedSeatNumbers];

        // FIX: Destructure [rows] because mysql2 returns [rows, fields]
        const [rows] = await executor.query(sql, params);

        console.log("rows", rows)

        if (!rows) return [];
        return Array.isArray(rows) ? rows : [rows];
    }
};