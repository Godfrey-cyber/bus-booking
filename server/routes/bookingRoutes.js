import { Router } from "express";
import { createBooking, allBookings, oneBooking, myBookings } from "../controllers/bookings.js";
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

// router.use(authenticate, authorize('Admin'));
router.use(authenticate);

router.get("/all-bookings", allBookings);
router.get("/my-bookings/:bookingID", myBookings);
router.post("/new-booking", createBooking);
router.get("/booking/:bookingID", oneBooking);
// router.put("/edit-booking/:bookingID", editbooking);

export default router;