import express from "express";
import { createLocation, allLocations, oneLocation } from "../controllers/locations.js";

const router = express.Router();

router.get("/all-locations", allLocations);
router.post("/new-location", createLocation);
router.get("/location/:locationID", oneLocation);
// router.put("/edit-location/:locationID", editLocation);

export default router;