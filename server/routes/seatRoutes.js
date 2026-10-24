import express from "express";
import { allSeats, oneSeat } from "../controllers/seats.js";

const router = express.Router();

router.get("/all-seats", allSeats);
// router.post("/new-seat", createSeat);
router.get("/seat/:seatID", oneSeat);
// router.put("/edit-bus/:busID", editBus);

export default router;