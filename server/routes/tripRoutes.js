import express from "express";
import { allTrips, oneTrip, createTrip } from "../controllers/trips.js";

const router = express.Router();

router.get("/all-trips", allTrips);
// router.get("/my-bookings/:bookingID", myBookings);
router.post("/new-trip", createTrip);
router.get("/trip/:tripID", oneTrip);
// router.put("/edit-booking/:bookingID", editbooking);

export default router;