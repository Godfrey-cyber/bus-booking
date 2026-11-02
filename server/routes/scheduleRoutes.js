import { Router } from "express";
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { createSchedule, getOperatorSchedules } from "../controllers/schedules.js";

const router = Router();
router.use(authenticate, authorize('Operator'));

// router.get("/all-schedules", allLocations);
router.post("/new-schedule", createSchedule);
router.get("/operator-schedules", getOperatorSchedules);
// router.get("/location/:locationID", oneLocation);
// router.put("/edit-location/:locationID", editLocation);

export default router;