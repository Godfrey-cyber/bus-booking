import { SeatModel } from "../models/Seat.js";

// @Get-all seats
export const allSeats = async (req, res) => {
	try {

	    const data = await SeatModel.getAll();
		// const data = await SeatsModel.getAll();
    	res.status(200).json({
    		success: true,
	        message: "Seatses fetched successfully",
	        data
    	})
	} catch(error) {
		res.status(500).json({
            success: false,
            message: error.message
        });
	}
};

export const oneSeat = async (req, res) => {
	const { seatID } = req.params;
	try {
	    const result = await SeatModel.getOne(seatID);
	    if (!result) {
	    	return res.status(404).json({ error: "Seat not found."})
	    }
	    res.status(201).json({
	    	success: true,
	        message: "Seat fetched successfully",
	        data: result
	    })
	} catch (error) {
		res.status(500).json({
            success: false,
            message: error.message
        });
	}
};