import { UserModel } from "../models/User.js";
import { OperatorProfileModel } from "../models/OperatorProfile.js"; 
import { PassengerProfileModel } from "../models/PassengerProfile.js"; 
import { pool } from '../db.js';
import { createRefreshToken, createAccessToken, verifyRefreshToken, validateEmail, validatePassword, hashToken } from "../utilities/utiles.js"
import { RefreshTokenModel } from '../models/RefreshToken.js';
import { AppError } from '../utilities/AppError.js';
import { asyncHandler } from '../utilities/asyncHandler.js';
import bcrypt from "bcryptjs"

/* ========================================================
 * 					Utility Functions
 * ========================================================
 */
function addDays(date, days) {
  	const result = new Date(date);
  	result.setDate(result.getDate() + days);
  	return result;
}

async function issueTokenPair(user, req) {
	const accessToken = createAccessToken(user);
	const refreshToken = createRefreshToken(user);

	await RefreshTokenModel.create({
	    user_id: user.id,
	    token_hash: hashToken(refreshToken),
	    user_agent: req.headers['user-agent'],
	    ip_address: req.ip,
	    expires_at: addDays(new Date(), 30),
	});

	return { accessToken, refreshToken };
}
			
function publicUser(user) {
  	return { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email, role: user.role, role_id: user.role_id ?? null, company_name :user.company_name, company_phone: user.company_phone };
}

/* =======================================================
 * 					End of Utility Functions
 * ========================================================
 */

// @Create new User
export const createPassenger = async (req, res) => {
	const { first_name, last_name, phone, email, password } = req.body;
	const conn = await pool.getConnection();

	if (!email || !password || !phone || !last_name || !first_name) {
        return res.status(400).json( { msg: '❌ Please enter all fields' } )
    }

	try {
		console.log(req.body)
		// check all fields

        await conn.beginTransaction();

        // Check if user exists.
        const ROLE_PASSENGER = 2;

        // 3. Create core user entry
        const userResult = await UserModel.create({
            email,
            password,
            role_id: ROLE_PASSENGER
        }, conn);

        const user_id = userResult.insertId;

        console.log("userResult", userResult) 

        // 4. Generate slug (e.g., company-name-123)
        // const slug = company_name.toLowerCase().replace(/[^a-z0-0]/g, '-') + `-${user_id}`;


        // 5. Create operator profile entry
        await PassengerProfileModel.create({
            user_id,
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            phone: phone.trim(),
        }, conn);

	    // 6. Commit transaction
        await conn.commit();


	    res.status(201).json({
	        success: true,
	        message: "Passenger account created successfully.",
	        data: { 
                id: user_id, 
                email, 
                first_name,
                last_name,
                phone 
            }
	    });
	} catch(error) {
		res.status(500).json({
            success: false,
            message: error.message
        });
	}
};

export const registerOperator = async (req, res) => {
	const { company_name, company_phone, company_email, password } = req.body;

	// 1. Input Validation
    if (!company_email || !password || !company_phone || !company_name) {
        return res.status(400).json({ success: false, message: 'Please enter all required fields.' });
    }

	const conn = await pool.getConnection();
	// const user_id = req.user.id
	try {
		await conn.beginTransaction();

        // Check if user exists.
        const ROLE_OPERATOR = 3;

        // 3. Create core user entry
        const userResult = await UserModel.create({
            email: company_email,
            password,
            role_id: ROLE_OPERATOR
        }, conn);

        const user_id = userResult.insertId;

	    // 4. Generate slug (e.g., company-name-123)
        const slug = company_name.toLowerCase().replace(/[^a-z0-0]/g, '-') + `-${user_id}`;

        // 5. Create operator profile entry
        await OperatorProfileModel.create({
            user_id,
            company_name: company_name.trim(),
            company_phone: company_phone.trim(),
            company_email: company_email.trim(),
            slug,
            // logo_url: logo_url || null
        }, conn);

	    // 6. Commit transaction
        await conn.commit();

	    res.status(201).json({
	        success: true,
	        message: "Operator account submitted successfully. Pending administrator verification.",
	        data: { 
                id: user_id, 
                company_email, 
                company_name,
                company_phone
            }
	    });
	    
	} catch (error) {
    	await conn.rollback();
    	if (error.code === 'ER_DUP_ENTRY') {
      		return res.status(409).json({ success: false, message: 'Email or company email is already in use.' });
    	}
    	console.log("error", error)
    	return res.status(500).json({ success: false, message: error.message });
  	} finally {
    	conn.release();
  	}
};

// login user env
export const loginUser = asyncHandler(async (req, res) => {
	const { password, email } = req.body
	// Check if all required fields are provided
	if(!email || !password) {
        throw new AppError('Email and password are required.', 400, 'AUTH_MISSING_CREDENTIALS');
    }

    // 2. Check if user exists in the database
    const user = await UserModel.findByEmail(email.trim().toLowerCase());

    // 3. Verify if password matches the stored bcrypt hash
    // if (!user || !(await UserModel.verifyPassword(password, user.password))) {
	//     throw new AppError('Invalid email or password.', 401, 'AUTH_INVALID_CREDENTIALS');
	// }

	if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AppError('Invalid email or password.', 401, 'AUTH_INVALID_CREDENTIALS');
    }

	if (user.status !== 'ACTIVE') {
	    throw new AppError('This account has been suspended. Contact support.', 403, 'AUTH_ACCOUNT_SUSPENDED');
	}

	const tokens = await issueTokenPair(user, req);
	// console.log(tokens)
    res.status(200).json({
	    success: true,
	    message: 'Login successful.',
	    data: { user: publicUser(user), ...tokens },
	});
})

// 	    // @Generate tokens
//         const accessToken = createAccessToken(payload);
//         const refreshToken = createRefreshToken(payload);

//         console.log(refreshToken, accessToken)

//         // Save refresh token in DB
//         // user.refreshTokens.push({ token: refreshToken });
//         // await user.save();

//         // Send refresh token to the front-end
//         res.cookie('refreshToken', refreshToken, {
//             path: "/",
//             httpOnly: true,
//             maxAge: 7 * 24 * 60 * 60 * 1000,
//             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
//             secure: process.env.NODE_ENV === 'production',
//         })

//         res.status(200).json({ 
//             success: true,
//             message: "Login successful.",
//       		accessToken,
//             user: { 
//                 _id: user.id,
//                 first_name: user.first_name,
//                 last_name: user.last_name,
//                 email: user.email,
//                 role_id: user.role_id,
//                 role: user.role,
//                 phone: user.phone,
//                 status: user.status,
//                 verified: user.verified
//             }
//         });

// 	} catch (error) {
// 		console.log(error)
//         return res.status(500).json({ success: false, message: error.message })
// 	}
// })

// @Get all Users
export const allOperators = async (req, res) => {
	try {
	    const result = await UserModel.getAll();
	    res.status(200).json({
	    	success: true,
	        message: "Users fetched successfully",
	        data: result
	    })
	} catch (error) {
		res.status(500).json({
            success: false,
            message: error.message
        });
	}
};

// @Get one User
export const oneUser = async (req, res) => {
	const { userID } = req.params;
	try {
	    const result = await UserModel.getOne(userID);
	    if (!result) {
	    	return res.status(404).json({ error: "User not found."})
	    }
	    res.status(201).json({
	    	success: true,
	        message: "User fetched successfully",
	        data: result
	    })
	} catch (error) {
		res.status(500).json({
            success: false,
            message: error.message
        });
	}
};

// @Edit User
export const editUser = async (req, res) => {
	try {
		const { userID } = req.params;
		const { phone } = req.body;

		if (!phone) {
			return res.status(400).json({ error: "Phone number os required" })
		}
	    const isUpdated = await UserModel.editUser(userID, phone); // req.body

	    if (!isUpdated) {
			return res.status(404).json({ error: "User not found, no changes made." })
		}
	    res.status(201).json({
	        success: true,
	        message: "Phone number updated successfully",
	        data: {
	            affectedRows: isUpdated.affectedRows,
	            insertId: Number(isUpdated.insertId)
	        }
	    });
	} catch(error) {
		res.status(500).json({
            success: false,
            message: error.message
        });
	}
};