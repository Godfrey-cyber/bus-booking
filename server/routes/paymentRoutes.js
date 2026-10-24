import { Router } from "express";
import { allPayments, onePayment, createPayment } from "../controllers/payments.js";
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

router.use(authenticate, authorize('Admin'));

router.get("/all-payments", allPayments);
router.post("/new-payment", createPayment);
router.get("/payment/:paymentID", onePayment);
// router.put("/edit-payment/:busID", editPayment);

export default router;