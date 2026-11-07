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
    },
    
    async generateForBus(busId, totalSeats) {
        if (!totalSeats || totalSeats <= 0) return;

        const seatsToInsert = [];
        const seatsPerRow = 4; // Standard 2x2 bus layout (2 left, aisle, 2 right)
        let seatCounter = 1;

        const totalRows = Math.ceil(totalSeats / seatsPerRow);

        for (let row = 1; row <= totalRows; row++) {
            for (let col = 1; col <= seatsPerRow; col++) {
                // Stop if we've generated up to the total capacity of the bus
                if (seatCounter > totalSeats) break;

                const seatNumber = String(seatCounter);

                // console.log(seatNumber)

                //[73,1,1,1,vip], [73,2,1,2,vip], [73,3,1,3,vip], [73,4,1,4,vip]

                // Example logic: Designate the first 2 rows as 'vip', rest as 'regular'
                const seatType = row <= 2 ? 'vip' : 'regular';

                // seatsToInsert.persisted = true; // (internal marker if needed)
               
                seatsToInsert.push([
                    busId,
                    seatNumber,
                    row, // row_index
                    col,  // col_index
                    seatType
                ]);

                seatCounter++;
            }
            
        }


        // Bulk insert all seats in a single efficient query
        const sql = `
            INSERT INTO bus_seats (bus_id, seat_number, row_index, col_index, seat_type) 
            VALUES (?, ?, ?, ?, ?)
        `;

        const result = await pool.batch(sql, [seatsToInsert]);

        console.log("seatsToInsert", seatsToInsert)
        console.log("result", result)
        return result;
    }
};
