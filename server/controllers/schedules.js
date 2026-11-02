import { ScheduleModel } from '../models/Schedules.js';
import { AppError } from '../utilities/AppError.js';
import { asyncHandler } from '../utilities/asyncHandler.js';
/**
 * @desc    Create a new schedule 
 * @schedule   POST /api/v1/schedule
 * @access  Private (Operator)
 */  
export const createSchedule = async (req, res) => {
  try {
    const operator_id = req?.user.id; // Extracted safely from Auth JWT Token
    const { route_id, departure_time, arrival_time, price, bus_id, reccurence_type, status } = req.body;

    console.log("user_id", req?.user.id)
    // console.log("req", req)

    const result = await ScheduleModel.create({
    	operator_id,
        route_id,
        departure_time,
        arrival_time,
        price,
        bus_id, 
        reccurence_type,
        status
    });

    const newSchedule = await ScheduleModel.getByIdAndOperator(
        result.insertId,
        operator_id
    );

    return res.status(201).json({
        success: true,
        message: 'Schedule created successfully',
        data: newSchedule
    });
  } catch (error) {
    console.error(`Error creating schedule for`, error.message);
    return res.status(500).json({
        success: false,
        message: 'Failed to create schedule due to an internal server error',
        errMsg: error.message
    });
  }
};

/**
 * @desc    Get paginated schedule for logged-in operator
 * @schedule   GET /api/v1/schedule
 * @access  Private (Operator)
 */
export const getOperatorSchedules = async (req, res) => {
    try {
        const operator_id = req?.user?.id;
        // console.log("req", req?.user?.id)
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const offset = (page - 1) * limit;

        const { data, total } = await ScheduleModel.getByOperatorId(operator_id, { 
            limit,
            offset
        });

        return res.status(200).json({
            success: true,
            message: 'Schedule retrieved successfully',
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            data
        });
    } catch (error) {
        console.error('Error retrieving operator schedule:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve schedule due to an internal server error'
        });
    }
};