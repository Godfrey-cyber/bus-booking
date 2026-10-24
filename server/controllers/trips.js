import { TripModel } from "../models/Trip.js";
import { ScheduleSeatModel } from "../models/ScheduleSeatModel.js";
import { pool } from "../db.js";

// @Get-all Trips
export const allTrips = async (req, res) => {
	try {
		const { origin, destination, amenities, operators, minPrice, maxPrice, sortBy } = req.query;
		const hasFilters = Boolean(
	      origin || destination || amenities || operators || minPrice || maxPrice || sortBy
	    );

		const data = hasFilters
	      ? await TripModel.search({ origin, destination, amenities, operators, minPrice, maxPrice, sortBy }) : await TripModel.getAll()
    	res.status(200).json({
    		success: true,
	        message: "Trips fetched successfully",
	        data
    	})
	} catch(error) {
		res.status(500).json({
            success: false,
            message: error.message
        });
	}
};

// @Get one Trip
export const oneTrip = async (req, res) => {
	const { tripID } = req.params;
	try {
	    const result = await TripModel.getOne(tripID);
	    if (!result) {
	    	return res.status(404).json({ error: "Trip not found."})
	    }
	    res.status(201).json({
	    	success: true,
	        message: "Trip fetched successfully",
	        data: result
	    })
	} catch (error) {
		res.status(500).json({
            success: false,
            message: error.message
        });
	}
};

export const createTrip = async (req, res) => {
  	let transaction;

  	try {
	    transaction = await pool.getConnection();
	    await transaction.beginTransaction();

	    const {
	      	bus_id,
	      	schedule_id,
	      	route_id,
	      	driver_id,
	      	trip_date,
	      	departure_time,
	      	arrival_time,
	      	price,
	      	status
	    } = req.body;

	    console.log(req.body)
	    // 1. Create the primary Trip record
	    const result = await TripModel.create(
		    {
		        schedule_id,
		        bus_id,
		        driver_id,
		        trip_date,
		        departure_time,
		        arrival_time,
		        price,
		        status
		    },
		    transaction
		);

		console.log("result:", result)

	    const tripId = result?.insertId;

	    if (!tripId) {
	      	throw new Error("Failed to insert trip. No insertId returned.");
	    }

	    // 2. Auto-generate bookable seats for this specific trip instance
	    await ScheduleSeatModel.createSeatsForTrip(
		    {
		    	schedule_id,
		    	bus_id
		    },
		    transaction
	    );

	    // 3. Commit everything
	    await transaction.commit();

	    return res.status(201).json({
	      	success: true,
	      	message: "Trip created successfully with bookable seats initialized.",
	      	data: {
	        	trip_id: tripId
	      	}
	    });
	} catch (error) {
	    if (transaction) await transaction.rollback();
	    console.error("Error creating trip:", error);
	    return res.status(500).json({
	      	success: false,
	      	message: error.message || "Failed to create trip and initialize seats."
	    });
  	} finally {
    	if (transaction) transaction.release();
  	}
};