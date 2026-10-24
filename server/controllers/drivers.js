import { DriverModel } from "../models/Driver.js";

// @Get-all Driver
export const drivers = async (req, res) => {
	try {
	    const data = await DriverModel.getAll();
		// const data = await BusModel.getAll();
    	res.status(200).json({
    		success: true,
	        message: "Drivers fetched successfully",
	        data
    	})
	} catch(error) {
		res.status(500).json({
            success: false,
            message: error.message
        });
	}
};

export const register = async (req, res) => {

}

export const driver = async (req, res) => {
	
}

export const operatorDrivers = async (req, res) => {
	
}