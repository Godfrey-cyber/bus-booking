import { PaymentModel } from "../models/Payment.js";

// @Get-all Payments
export const allPayments = async (req, res) => {
	try {
		const { origin, destination, amenities, operators, minPrice, maxPrice, sortBy } = req.query;
		console.log("payments-user", req.user)
		const hasFilters = Boolean(
	      origin || destination || amenities || operators || minPrice || maxPrice || sortBy
	    );

	    const data = hasFilters
	      ? await PaymentModel.search({ origin, destination, amenities, operators, minPrice, maxPrice, sortBy })
	      : await PaymentModel.getAll();
    	res.status(200).json({
    		success: true,
	        message: "Payments fetched successfully!",
	        data
    	})
	} catch(error) {
		res.status(500).json({
            success: false,
            message: error.message
        });
	}
};

// @Get one Payment
export const onePayment = async (req, res) => {
	const { busID } = req.params;
	try {
	    const result = await PaymentModel.getOne(PaymentID);
	    if (!result) {
	    	return res.status(404).json({ error: "Payment not found."})
	    }
	    res.status(201).json({
	    	success: true,
	        message: "Payment fetched successfully",
	        data: result
	    })
	} catch (error) {
		res.status(500).json({
            success: false,
            message: error.message
        });
	}
};

// @Create new Payment
export const createPayment = async (req, res) => {
	try {
	    const result = await PaymentModel.create(req.body);
	    res.status(201).json({
	        success: true,
	        message: "Payment created successfully",
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