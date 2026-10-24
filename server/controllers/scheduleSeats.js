import { ScheduleSeatModel } from "../models/ScheduleSeatModel.js";

// @Get-all seats
export const tripSeats = async (req, res) => {
	try {
		const { tripID, busID } = req.params;

		console.log("req", req.params);

		console.log("tripID", tripID);
		console.log("busID", busID);

	    const data = await ScheduleSeatModel.getTripSeats(Number(tripID), Number(busID));
    	res.status(200).json({
    		success: true,
	        message: "Seats fetched successfully",
	        data
    	})
    	console.log("data", data)
	} catch(error) {
		res.status(500).json({
            success: false,
            message: error.message
        });
	}
};