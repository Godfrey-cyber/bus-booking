import express from "express";
import { addBookingSeat } from "../controllers/bookingSeats.js";

const router = express.Router();

// router.get("/all-bookings", allBookings);
// router.get("/my-bookings/:bookingID", myBookings);
// router.post("/new-booking", createBooking);
// router.get("/booking/:bookingID", oneBooking);
router.put("/add-booking-seat/:bookingSeatID", addBookingSeat);

export default router;