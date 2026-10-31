import { Router } from "express";
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { createDestination, getOperatorDestinations } from "../controllers/destinations.js";

const router = Router();
router.use(authenticate, authorize('Operator'));

// router.get("/all-locations", allLocations);
router.post("/new-location", createDestination);
router.get("/operator-locations", getOperatorDestinations);
// router.get("/location/:locationID", oneLocation);
// router.put("/edit-location/:locationID", editLocation);

export default router;