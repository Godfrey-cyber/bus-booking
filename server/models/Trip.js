import { pool } from "../db.js";

export const TripModel = {
    async getAll() {
        const conn = await pool.getConnection();
        try {
            // return await conn.query("SELECT t.id AS schedule_id, o.name AS operator_name, o.id, o.rating_avg, b.plate_number, b.amenities, s.departure_time, s.arrival_time, b.id AS bus_id, b.model AS bus_name, r.id AS route_id, r.origin_id, r.destination_id, r.distance_km, r.duration_minutes, s.price, r.boarding_point, r.arrival_point FROM schedules s INNER JOIN routes r ON s.route_id = r.id INNER JOIN buses b ON s.bus_id = b.id JOIN operators o ON r.operator_id = o.id GROUP BY o.id");
            // return await conn.query("SELECT b.id, b.created_at, b.booking_reference, b.status, u.first_name, r.boarding_point, r.arrival_point, b.passenger_count, o.name AS operator, t.trip_date, s.departure_time, s.arrival_time, b.total_amount, ss.bus_seat_id FROM bookings b INNER JOIN schedules s ON b.schedule_id = s.id INNER JOIN routes r ON s.route_id = r.id INNER JOIN trips t ON b.schedule_id = t.schedule_id INNER JOIN schedule_seats ss ON s.id = ss.schedule_id INNER JOIN users u ON b.user_id = u.id INNER JOIN operators o ON o.id = r.operator_id ORDER BY created_at ASC LIMIT 10");
            const sql = `SELECT
                t.id AS trip_id,
                t.trip_date,
                t.departure_time,
                t.arrival_time,
                t.price,
                t.status,

                b.id AS bus_id,
                b.plate_number,
                b.model AS bus_model,
                b.capacity,
                b.amenities,

                o.id AS operator_id,
                o.rating_avg,
                o.name AS operator_name,

                r.id AS route_id,
                r.distance_km AS distance,
                r.duration_minutes,
                r.boarding_point,
                r.arrival_point,
                origin.city AS origin,
                destination.city AS destination,

                s.id AS schedule_id

            FROM trips t

            JOIN schedules s
                ON t.schedule_id = s.id

            JOIN routes r
                ON s.route_id = r.id

            JOIN locations origin
                ON r.origin_id = origin.id

            JOIN locations destination
                ON r.destination_id = destination.id

            JOIN buses b
                ON t.bus_id = b.id

            JOIN operators o
                ON b.operator_id = o.id

            WHERE t.status = 'scheduled'
            ORDER BY t.departure_time ASC`
            return await conn.query(sql)
        } finally {
            conn.release();
        }
    },

    getById: async (trip_id, transaction) => {
        const executor = transaction || pool.getConnection();;
        const rows = await executor.query(
          `
          SELECT
            id,
            bus_id,
            trip_date,
            driver_id,
            schedule_id,
            departure_time,
            arrival_time,
            price
          FROM trips
          WHERE id = ?
          LIMIT 1
          `,
          [trip_id]
        );

        return rows.length > 0 ? rows[0] : null;
    },

    async getOne(tripID) {
        const conn = await pool.getConnection();
        try {
            const sql = `SELECT
                t.id AS trip_id,
                t.trip_date,
                t.departure_time,
                t.arrival_time,
                t.price,
                t.status,

                b.id AS bus_id,
                b.plate_number,
                b.model AS bus_model,
                b.capacity,
                b.amenities,

                o.id AS operator_id,
                o.rating_avg,
                o.name AS operator_name,

                r.id AS route_id,
                r.distance_km AS distance,
                r.duration_minutes,
                r.boarding_point,
                r.arrival_point,

                origin.city AS origin,
                destination.city AS destination,

                s.id AS schedule_id

            FROM trips t

            JOIN schedules s
                ON t.schedule_id = s.id

            JOIN routes r
                ON s.route_id = r.id

            JOIN locations origin
                ON r.origin_id = origin.id

            JOIN locations destination
                ON r.destination_id = destination.id

            JOIN buses b
                ON t.bus_id = b.id

            JOIN operators o
                ON b.operator_id = o.id

            WHERE t.status = 'scheduled' AND t.id = ?
            ORDER BY t.departure_time ASC`
            return await conn.query(sql, [tripID])
        } finally {
            conn.release();
        }
    },

    async getOperatorTrips(tripID) {
        const conn = await pool.getConnection();
        try {
            const sql = `SELECT
                t.id AS trip_id,
                t.trip_date,
                t.departure_time,
                t.arrival_time,
                t.price,
                t.status,

                b.id AS bus_id,
                b.plate_number,
                b.model AS bus_model,
                b.capacity,
                b.amenities,

                o.id AS operator_id,
                o.rating_avg,
                o.name AS operator_name,

                origin.city AS origin,
                destination.city AS destination,

                s.id AS schedule_id

            FROM trips t

            JOIN schedules s
                ON t.schedule_id = s.id

            JOIN locations destination
                ON r.destination_id = destination.id

            JOIN buses b
                ON t.bus_id = b.id

            JOIN operators o
                ON b.operator_id = o.id

            WHERE t.status = 'scheduled' AND t.id = ?
            ORDER BY t.departure_time ASC`
            return await conn.query(sql, [tripID])
        } finally {
            conn.release();
        }
    },

    async search({
        origin,
        destination,
        amenities,
        operators,
        minPrice,
        maxPrice,
        sortBy
      }) {
        const conn = await pool.getConnection();

        try {
          let sql = `
            SELECT
              t.id AS trip_id,
              t.trip_date,
              t.departure_time,
              t.arrival_time,
              t.price,
              t.status,

              b.id AS bus_id,
              b.plate_number,
              b.model AS bus_model,
              b.capacity,
              b.amenities,

              o.id AS operator_id,
              o.name AS operator_name,

              r.id AS route_id,
              r.distance_km AS distance,
              r.duration_minutes,
              r.boarding_point,
              r.arrival_point,
              origin.city AS origin,
              destination.city AS destination,

              s.id AS schedule_id

            FROM trips t

            JOIN schedules s
              ON t.schedule_id = s.id

            JOIN routes r
              ON s.route_id = r.id

            JOIN locations origin
              ON r.origin_id = origin.id

            JOIN locations destination
              ON r.destination_id = destination.id

            JOIN buses b
              ON t.bus_id = b.id

            JOIN operators o
              ON b.operator_id = o.id

            WHERE t.status = 'scheduled'
          `;

          const params = [];

          // Origin
          if (origin) {
            sql += ` AND origin.city = ?`;
            params.push(origin);
          }

          // Destination
          if (destination) {
            sql += ` AND destination.city = ?`;
            params.push(destination);
          }

          // Operators
          if (operators) {
            const operatorIds = operators.split(",");

            sql += ` AND o.id IN (${operatorIds.map(() => "?").join(",")})`;
            params.push(...operatorIds);
          }

          // Minimum price
          if (minPrice) {
            sql += ` AND t.price >= ?`;
            params.push(Number(minPrice));
          }

          // Maximum price
          if (maxPrice) {
            sql += ` AND t.price <= ?`;
            params.push(Number(maxPrice));
          }

          // Amenities
          if (amenities) {
            const amenityList = amenities.split(",");

            for (const amenity of amenityList) {
              sql += ` AND JSON_CONTAINS(b.amenities, ?)`;
              params.push(JSON.stringify(amenity));
            }
          }

          // Sorting
          switch (sortBy) {
            case "price_asc":
              sql += ` ORDER BY t.price ASC`;
              break;

            case "price_desc":
              sql += ` ORDER BY t.price DESC`;
              break;

            case "departure_asc":
              sql += ` ORDER BY t.departure_time ASC`;
              break;

            case "departure_desc":
              sql += ` ORDER BY t.departure_time DESC`;
              break;

            default:
              sql += ` ORDER BY t.departure_time ASC`;
          }

          const rows = await conn.query(sql, params);

          return rows;
        } finally {
          conn.release();
        }
    },

    create: async (tripData, transaction) => {
        const executor = transaction || pool.getConnection();;

        const sql = `
            INSERT INTO trips (
                operator_id, schedule_id, bus_id, driver_id, trip_date, 
                departure_time, arrival_time, price, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            tripData.operator_id,
            tripData.schedule_id,
            tripData.bus_id,
            tripData.driver_id || null,
            tripData.trip_date,
            tripData.departure_time,
            tripData.arrival_time,
            tripData.price,
            tripData.status || "scheduled",
        ];

        console.log(params)

            // mysql2 returns [ResultSetHeader, FieldPacket[]]
        const result = await executor.query(sql, params);
        return result; // Returns plain ResultSetHeader object containing insertId
    }
};

// const sql = `SELECT
//     t.id AS trip_id,
//     t.trip_date,
//     t.departure_time,
//     t.arrival_time,
//     t.price,
//     t.status,

//     b.id AS bus_id,
//     b.plate_number,
//     b.model AS bus_model,
//     b.capacity,
//     b.amenities,

//     o.id AS operator_id,
//     o.name AS operator_name,

//     r.id AS route_id,
//     origin.city AS origin,
//     destination.city AS destination,

//     s.id AS schedule_id

// FROM trips t

// JOIN schedules s
//     ON t.schedule_id = s.id

// JOIN routes r
//     ON s.route_id = r.id

// JOIN locations origin
//     ON r.origin_id = origin.id

// JOIN locations destination
//     ON r.destination_id = destination.id

// JOIN buses b
//     ON t.bus_id = b.id

// JOIN operators o
//     ON b.operator_id = o.id

// WHERE t.status = 'scheduled'
// ORDER BY t.departure_time ASC`


  
