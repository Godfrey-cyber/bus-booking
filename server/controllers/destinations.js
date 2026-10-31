import { DestinationModel } from '../models/Destinations.js';
import { AppError } from '../utilities/AppError.js';
import { asyncHandler } from '../utilities/asyncHandler.js';
/**
 * @desc    Create a new operator destination
 * @route   POST /api/v1/destinations
 * @access  Private (Operator)
 */
export const createDestination = async (req, res) => {
  try {
    const operator_id = req?.user?.id; // Extracted safely from Auth JWT Token
    const { city, country, latitude, longitude, image } = req.body;

    console.log("user_id", req.user.id)
    // console.log("req", req)

    const result = await DestinationModel.create({
        operator_id,
        city,
        country,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        image
    });

    const newDestination = await DestinationModel.getByIdAndOperator(
        result.insertId,
        operator_id
    );

    return res.status(201).json({
        success: true,
        message: 'Location created successfully',
        data: newDestination
    });
  } catch (error) {
    console.error('Error creating location:', error);
    return res.status(500).json({
        success: false,
        message: 'Failed to create location due to an internal server error'
    });
  }
};

/**
 * @desc    Get paginated destinations for logged-in operator
 * @route   GET /api/v1/destinations
 * @access  Private (Operator)
 */
export const getOperatorDestinations = async (req, res) => {
    try {
        const operator_id = req?.user?.id;
        console.log("req", req?.user?.id)
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const offset = (page - 1) * limit;

        const { data, total } = await DestinationModel.getByOperatorId(operator_id, { 
            limit,
            offset
        });

        console.log("data", data)

        return res.status(200).json({
            success: true,
            message: 'Destinations retrieved successfully',
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            data
        });
    } catch (error) {
    console.error('Error retrieving operator destinations:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve destinations due to an internal server error'
        });
    }
};