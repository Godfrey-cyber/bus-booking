import { Router } from "express";
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { createBus, allBuses, oneBus, operatorBuses } from "../controllers/buses.js";

const router = Router();
router.use(authenticate, authorize('Operator'));

router.get("/all-buses", allBuses); // /buses/operator/
router.post("/new-bus", createBus);
router.get("/bus/:busID", oneBus);
router.get("/operator-buses", operatorBuses);
// router.put("/edit-bus/:busID", editBus);

export default router;