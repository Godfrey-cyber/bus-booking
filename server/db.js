import mariadb from "mariadb";

export const pool = mariadb.createPool({
    host: process.env.MARIADB_HOST,
    port: Number(process.env.MARIADB_PORT),
    user: "root",
    password: process.env.MARIADB_ROOT_PASSWORD,
    database: process.env.MARIADB_DATABASE,
    connectionLimit: 5,
    insertIdAsNumber: true,
    bigIntAsNumber: true
});

// curl -X POST http://localhost:8000/api/v1/trips/new-trip -H "Content-Type: application/json" -d '{
//     "schedule_id": 2,
//     "bus_id": 2,
//     "driver_id": 2,
//     "trip_date": "2026-10-17",
//     "departure_time": "2026-10-17 08:00:00",
//     "arrival_time": "2026-10-17 14:00:00",
//     "price": 1500.00,
//     "status": "scheduled"
// }'

// curl -X POST http://localhost:8000/api/v1/operators/new-operator -H "Content-Type: application/json" -d '{
//     "name": "Easy Coach",
//     "contact_email": "easycoach@gmail.com",
//     "slug": "easy-coach",
//     "logo_url": "https://example.com/logos/coast-riders.png",
//     "contact_phone": "0784576234",
// }'



// curl -X POST http://localhost:5000/api/v1/customers/new-customer -H "Content-Type: application/json" -d '{
//   "first_name": "Ellena",
//   "last_name": "Smith",
//   "age": 35,
//   "country": "Zambia",
//   "email": "ellena@gmail.com",
//   "gender": "Female",
//   "password": "123adcvre"
// }'

// curl -X PUT http://localhost:5000/api/v1/users/edit-user/1 -H "Content-Type: application/json" -d '{
//   "phone": "0712345678",
// }'