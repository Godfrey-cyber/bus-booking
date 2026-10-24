import express from "express";
import { tripSeats } from "../controllers/scheduleSeats.js";

const router = express.Router();

router.get("/:tripID/seats/:busID", tripSeats); // trip-seats/${trip_id}/seats/${bus_id}
// router.post("/new-seat", createSeat);
// router.get("/seat/:seatID", oneSeat);
// router.put("/edit-bus/:busID", editBus);

export default router;