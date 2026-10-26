import { DriverModel } from "../models/Driver.js";
import { asyncHandler } from '../utilities/asyncHandler.js';
import { AppError } from '../utilities/AppError.js';
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

// @Create new Driver
export const createDriver = asyncHandler(async (req, res) => {
    const operator_id = req.user?.id;

    if (!operator_id) {
        throw new AppError('Unauthorized: Context missing user identity', 401, 'AUTH_UNAUTHORIZED');
    }

    const { name, license_number, phone, bus_id } = req.body
    console.log("req", req.body)
    try {
        const result = await DriverModel.create({ 
            name, 
            license_number, 
            phone, 
            bus_id,  
            operator_id
        });
        res.status(201).json({
            success: true,
            message: "Driver created successfully",
            data: {
                affectedRows: result.affectedRows,
                id: Number(result.insertId),
                name,
                license_number,
                phone,
                bus_id,
                operator_id
            }
        }); // amenities
        console.log("result", result)
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            throw new AppError(
                `A driver with license number '${license_number}' is already registered under your account.`, 
                409, 
                'LICENSE_NUMBER_DUPLICATE'
            );
        }
        throw error;
    }
});

export const driver = async (req, res) => {
	
}


export const operatorDrivers = async (req, res) => {
    try {
        // Use operator_id if present on user object, fallback to user.id
        const operator_id = req.user?.id;

        console.log("operator_id", operator_id)

        if (!operator_id) {
            return res.status(400).json({
                success: false,
                message: 'Operator ID is required',
            });
        }
        // console.log("req", req)
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const offset = (page - 1) * limit;

        const { drivers, total } = await DriverModel.getOperatorDrivers(operator_id, {
            limit,
            offset
        });
        console.log("drivers", drivers)
        console.log("total", total)
        return res.status(200).json({
            success: true,
            message: 'Operator Drivers retrieved successfully',
            data: drivers,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
    console.error('Error retrieving operator drivers:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve drivers due to an internal server error'
        });
    }
};