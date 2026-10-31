import { Router } from "express";
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { createRoute, getOperatorRoutes } from "../controllers/routes.js";

const router = Router();
router.use(authenticate, authorize('Operator'));

// router.get("/all-routes", allLocations);
router.post("/new-route", createRoute);
router.get("/operator-routes", getOperatorRoutes);
// router.get("/location/:locationID", oneLocation);
// router.put("/edit-location/:locationID", editLocation);

export default router;