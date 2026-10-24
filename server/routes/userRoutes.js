import express from "express";
import { createPassenger, registerOperator, allOperators, oneUser, editUser, loginUser } from "../controllers/users.js";

const router = express.Router();

// router.get("/all-users", allUsers);
router.get("/operators", allOperators);
router.post("/register/passenger", createPassenger);
router.post("/register/operator", registerOperator);
router.post("/login-user", loginUser);
router.get("/user/:userID", oneUser);
router.put("/edit-user/:userID", editUser);

export default router;