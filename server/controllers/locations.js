import { LocationModel } from "../models/Location.js";

// @Get-all Locations
export const allLocations = async (req, res) => {
	try {
		const data = await LocationModel.getAll();
    	res.status(200).json({
    		success: true,
	        message: "Locations fetched successfully",
	        data
    	})
	} catch(error) {
		res.status(500).json({
            success: false,
            message: error.message
        });
	}
};

// @Get one Location
export const oneLocation = async (req, res) => {
	const { locationID } = req.params;
	try {
	    const result = await LocationModel.getOne(locationID);
	    if (!result) {
	    	return res.status(404).json({ error: "Location not found."})
	    }
	    res.status(201).json({
	    	success: true,
	        message: "Location fetched successfully",
	        data: result
	    })
	} catch (error) {
		res.status(500).json({
            success: false,
            message: error.message
        });
	}
};

// @Create new Location
export const createLocation = async (req, res) => {
	try {
	    const result = await LocationModel.create(req.body);
	    res.status(201).json({
	        success: true,
	        message: "Location created successfully",
	        data: {
	            affectedRows: result.affectedRows,
	            insertId: Number(result.insertId)
	        }
	    });
	} catch (error) {
		res.status(500).json({
            success: false,
            message: err.message
        });
	}
};