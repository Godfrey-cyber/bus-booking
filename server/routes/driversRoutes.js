import { Router } from "express";
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { createDriver, drivers, driver, operatorDrivers } from "../controllers/drivers.js";

const router = Router();
router.use(authenticate, authorize('Operator'));

router.get("/all-drivers", drivers); // /buses/operator/
router.post("/new-driver", createDriver);
router.get("/driver/:driverID", driver);
router.get("/operator-drivers", operatorDrivers);
// router.put("/edit-bus/:busID", editBus);

export default router;