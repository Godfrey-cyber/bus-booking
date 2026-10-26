import { BusModel } from "../models/Bus.js";
import { asyncHandler } from '../utilities/asyncHandler.js';
import { AppError } from '../utilities/AppError.js';

// @Get-all Bus
export const allBuses = async (req, res) => {
	try {
		const { origin, destination, amenities, operators, minPrice, maxPrice, sortBy } = req.query;
		
		const hasFilters = Boolean(
	      origin || destination || amenities || operators || minPrice || maxPrice || sortBy
	    );

	    const data = hasFilters
	      ? await BusModel.search({ origin, destination, amenities, operators, minPrice, maxPrice, sortBy })
	      : await BusModel.getAll();
		// const data = await BusModel.getAll();
    	res.status(200).json({
    		success: true,
	        message: "Buses fetched successfully",
	        data
    	})
	} catch(error) {
		res.status(500).json({
            success: false,
            message: error.message
        });
	}
};

// @Get one Bus
export const oneBus = async (req, res) => {
	const { busID } = req.params;
	try {
	    const result = await BusModel.getOne(busID);
	    if (!result) {
	    	return res.status(404).json({ error: "Bus not found."})
	    }
	    res.status(201).json({
	    	success: true,
	        message: "Bus fetched successfully",
	        data: result
	    })
	} catch (error) {
		res.status(500).json({
            success: false,
            message: error.message
        });
	}
};

// @Create new Bus
export const createBus = asyncHandler(async (req, res) => {
	const operator_id = req.user?.id;

	if (!operator_id) {
    	throw new AppError('Unauthorized: Context missing user identity', 401, 'AUTH_UNAUTHORIZED');
  	}

	const { plate_number, model, capacity, amenities, status } = req.body
	try {
	    const result = await BusModel.create({ 
	    	plate_number, 
	    	model, 
	    	capacity, 
	    	amenities, 
	    	status, 
	    	operator_id
	    });
	    res.status(201).json({
	        success: true,
	        message: "Bus created successfully",
	        data: {
	            affectedRows: result.affectedRows,
	            id: Number(result.insertId),
		        plate_number,
		        model,
		        capacity,
		        status,
		        amenities,
		        operator_id
			}
	    });
	} catch (error) {
		if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
	      	throw new AppError(
	        	`A bus with plate number '${plate_number}' is already registered under your account.`, 
	        	409, 
	        	'BUS_PLATE_DUPLICATE'
	      	);
	    }
	    throw error;
	}
});

/**
 * @desc    Get paginated destinations for logged-in operator
 * @route   GET /api/v1/destinations
 * @access  Private (Operator)
 */
export const operatorBuses = async (req, res) => {
    try {
        // Use operator_id if present on user object, fallback to user.id
        const operator_id = req.user?.id || req.user?.operator_id;

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

        const { buses, total } = await BusModel.getOperatorBuses(operator_id, {
            limit,
            offset
        });
        
        return res.status(200).json({
            success: true,
            message: 'Operator Buses retrieved successfully',
            data: buses,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
    console.error('Error retrieving operator buses:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve buses due to an internal server error'
        });
    }
};