import { RouteModel } from '../models/Routes.js';
import { AppError } from '../utilities/AppError.js';
import { asyncHandler } from '../utilities/asyncHandler.js';
/**
 * @desc    Create a new operator destination
 * @route   POST /api/v1/destinations
 * @access  Private (Operator)
 */
export const createRoute = async (req, res) => {
  try {
    const operator_id = req?.user.id; // Extracted safely from Auth JWT Token
    const { origin_id, destination_id, boarding_point, arrival_point, distance_km, duration_minutes, status } = req.body;

    console.log("user_id", req?.user.id)
    // console.log("req", req)

    const result = await RouteModel.create({
    	operator_id,
        origin_id,
        destination_id,
        boarding_point,
        arrival_point,
        distance_km, 
        duration_minutes,
        // base_price,
        status
    });

    const newRoute = await RouteModel.getByIdAndOperator(
        result.insertId,
        operator_id
    );

    return res.status(201).json({
        success: true,
        message: 'Route created successfully',
        data: newRoute
    });
  } catch (error) {
    console.error(`Error creating route for`, error.message);
    return res.status(500).json({
        success: false,
        message: 'Failed to create route due to an internal server error',
        errMsg: error.message
    });
  }
};

/**
 * @desc    Get paginated routes for logged-in operator
 * @route   GET /api/v1/routes
 * @access  Private (Operator)
 */
export const getOperatorRoutes = async (req, res) => {
    try {
        const operator_id = req?.user?.id;
        // console.log("req", req?.user?.id)
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const offset = (page - 1) * limit;

        const { data, total } = await RouteModel.getByOperatorId(operator_id, { 
            limit,
            offset
        });

        return res.status(200).json({
            success: true,
            message: 'Routes retrieved successfully',
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            data
        });
    } catch (error) {
        console.error('Error retrieving operator routes:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve routes due to an internal server error'
        });
    }
};