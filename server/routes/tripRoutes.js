import { Router } from "express";
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { allTrips, oneTrip, createTrip } from "../controllers/trips.js";

const router = Router();
router.use(authenticate, authorize('Operator'));

router.get("/all-trips", allTrips);
// router.get("/my-bookings/:bookingID", myBookings);
router.post("/new-trip", createTrip);
router.get("/trip/:tripID", oneTrip);
// router.put("/edit-booking/:bookingID", editbooking);

export default router;