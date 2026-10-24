import { Router } from "express";
import { createOperator, operators, oneOperator, changeStatus } from "../controllers/operators.js";
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

router.use(authenticate, authorize('Admin'));

router.get("/all-operators", operators);
router.post("/new-operator", createOperator);
router.get("/operator/:operatorID", oneOperator);
router.patch("/status/:operatorID", changeStatus);
// router.put("/edit-operator/:locationID", editLocation);

export default router;