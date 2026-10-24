import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
dotenv.config()
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

import { pool } from "./db.js"

import userRoutes from "./routes/userRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import driversRoutes from "./routes/driversRoutes.js";
import operatorRoutes from "./routes/operatorRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import seatRoutes from "./routes/seatRoutes.js";
import scheduleSeatsRoutes from "./routes/scheduleSeatsRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
// import bookingRoutes from "./routes/bookingRoutes.js";

// 


const app = express();

app.use(cookieParser());

app.use(cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowdHeaders: [
        "Content-Type",
        "Authorization",
        "Cookie",
        "Cache-Control",
        "Expires",
        "Pragma"
    ],
    credentials: true
}))
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} - ${req.originalUrl}`, new Date().toISOString());
    next();
});
app.get('/api/v1/health', (req, res) => res.json({ success: true, message: 'FleetGo API is up.' }));

// @Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/locations", locationRoutes);
app.use("/api/v1/buses", busRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/drivers", driversRoutes);
app.use("/api/v1/operators", operatorRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/trips", tripRoutes);
app.use("/api/v1/seats", seatRoutes);
app.use("/api/v1/trip-seats", scheduleSeatsRoutes);
app.use("/api/v1/destinations", destinationRoutes);
// app.use("/api/v1/bookings", bookingRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        msg: `${req.method} - ${req.originalUrl} is not a recognized route.`
    });
});
app.use(notFoundHandler);
app.use(errorHandler);


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Success server running on port ${PORT} 💯`);
});