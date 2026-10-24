import { OperatorModel } from "../models/Operator.js"; // OperatorProfileModels
import { OperatorProfileModel } from "../models/OperatorProfile.js"; 
import { asyncHandler } from '../utilities/asyncHandler.js';
import { AppError } from '../utilities/AppError.js';
// @Get-all Operator  
export const allOperators = asyncHandler(async (req, res) => {
	try {
		const { name, status, avg_rating, operators, sortBy } = req.query;
		
		const hasFilters = Boolean(
	      name || status || avg_rating || sortBy
	    );

	    const data = hasFilters
	      ? await OperatorModel.search({ name, status, avg_rating, sortBy })
	      : await OperatorModel.getAll();
		// const data = await OperatorModel.getAll();
    	res.status(200).json({
    		success: true,
	        message: "Operators fetched successfully",
	        data
    	})
	} catch(error) {
		res.status(500).json({
            success: false,
            message: error.message
        });
	}
});

export const operators = asyncHandler(async (req, res) => {
	const { name, status, avg_rating, operators, sortBy } = req.query;

	console.log("user", req.user)
		
	const hasFilters = Boolean(
      	name || status || avg_rating || sortBy
    );

    const data = hasFilters
      	? await OperatorProfileModel.search({ name, status, avg_rating, sortBy })
      	: await OperatorProfileModel.getAll();
      	console.log("data", data)
    res.status(200).json({ success: true, data });
});

export const suspendOperator = asyncHandler(async (req, res) => {
//   	await pool.query('UPDATE operators SET status = "suspended" WHERE id = ?', [req.params.id]);
//   	res.status(200).json({ success: true, message: 'Operator suspended.' });
});

// @Get one Operator
export const oneOperator = async (req, res) => {
	const { operatorID } = req.params;

	try {
	    const result = await OperatorModel.getOne(operatorID);
	    if (!result) {
	    	return res.status(404).json({ error: "Operator not found."})
	    }
	    res.status(201).json({
	    	success: true,
	        message: "Operator fetched successfully",
	        data: result
	    })
	} catch (error) {
		res.status(500).json({
            success: false,
            message: error.message
        });
	}
};

// @Create new Operator
export const createOperator = async (req, res) => {
	try {
		const operator_id = req.user.id
		console.log("operator_id", operator_id)
		const { name, contact_email, slug, logo_url, contact_phone } = req.body;

	    const result = await OperatorModel.create({ name, contact_email, slug, logo_url, contact_phone });
	    
	    res.status(201).json({
	        success: true,
	        message: "Operator created successfully",
	        data: {
	            affectedRows: result.affectedRows,
	            insertId: Number(result.insertId)
	        }
	    });
	} catch (error) {
		res.status(500).json({
            success: false,
            message: error.message
        });
	}
};

// @Change status of operator
export const changeStatus = asyncHandler(async (req, res) => {
	const { operatorID } = req.params
	const { status } = req.body;

	console.log("===========================")
	console.log("operatorID", operatorID)
	console.log("status", status)
	console.log("===========================")

	if (!["active", "suspended"].includes(status)) {
	    throw new AppError('Invalid status value. Must be "active" or "suspended".', 400, 'AUTH_INVALID_VALUE');
	}

	if (!operatorID || !status) {
        throw new AppError('Missing operatorID or status value.', 400, 'MISSING_VALUES');
    }

	const affectedRows = await OperatorProfileModel.updateStatus(operatorID, status);
	console.log("affectedRows", affectedRows)
	if (!affectedRows) {
	    throw new AppError('Operator not found', 404, 'INVALID_VALUE');
	}

	return res.status(200).json({
	    success: true,
	    message: `Operator ${status === 'suspended' ? 'suspended' : 'reactivated'} successfully.`,
	});


    // await pool.query('UPDATE operators SET status = "suspended" WHERE id = ?', [id]);
    // res.status(200).json({ success: true, message: 'Operator suspended.' });
});
