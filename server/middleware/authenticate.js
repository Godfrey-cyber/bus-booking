import { verifyAccessToken } from '../utilities/utiles.js';
import { AppError } from '../utilities/AppError.js';
import { asyncHandler } from '../utilities/asyncHandler.js';
import { UserModel } from "../models/User.js";
import { OperatorModel } from "../models/Operator.js";
// import { UserModel } from "../models/User.js";


export const authenticate = asyncHandler(async (req, res, next) => {
	const header = req.headers.authorization;

	if (!header || !header.startsWith('Bearer ')) {
	    throw new AppError('Authentication required.', 401, 'AUTH_NO_TOKEN');
	}

	const token = header.slice('Bearer '.length).trim();
	
	if (!token) {
	    throw new AppError('Authentication required.', 401, 'AUTH_NO_TOKEN');
	}

	let payload;

	try {
	    payload = verifyAccessToken(token);
	    console.log("_____payload_____")
	    console.log("payload", payload)
	    console.log("_____payload_____")
	    
	} catch (err) {
	    if (err.name === 'TokenExpiredError') {
	    	// console.log("err", err)
	      	// Distinct code so the frontend can silently call /auth/refresh and
	      	// retry, instead of bouncing the user to the login screen.
	      	throw new AppError('Access token expired.', 401, 'AUTH_TOKEN_EXPIRED');
	    }
	    throw new AppError(`Invalid access token. ${err} - ${payload}`, 401, 'AUTH_TOKEN_INVALID');
	}

	const account = await UserModel.findByEmail(payload.email)
	// const account = payload.role === 'Operator'
    //   	? await OperatorModel.getOne(payload.sub)
    //   	: await UserModel.getOne(payload.sub);

  	console.log("UserModel", await UserModel.findByEmail(payload.email))
   	console.log("account equal =", account.status == 'ACTIVE')

   	console.log("account", account)

	// 2. Validate existence
	if (!account) {
	    throw new AppError('The account for this token no longer exists.', 401, 'AUTH_USER_NOT_FOUND');
	}

	// 3. Validate status
	if (account?.status !== 'ACTIVE') {
	    throw new AppError('This account has been suspended.', 403, 'AUTH_ACCOUNT_SUSPENDED');
	}

	// 4. Attach unified user object to req
	req.user = {
	    id: account.id,
	    role: account.role,
	    // role_id: payload.role === 'Operator' ? account.id : (account.operator_id ?? null),
	    role_id: account.role_id,
	    email: account.email || account.contact_email
	};

	console.log("req.user", req.user)

	// console.log("req.user", req.user)

	next();
});


/* 
 * For endpoints that behave differently for logged-in users without requiring
 * login (e.g. showing "already booked" state on a public bus listing).
 */

export const authenticateOptional = asyncHandler(async (req, res, next) => {
	const header = req.headers.authorization;
	if (!header || !header.startsWith('Bearer ')) return next();

	try {
	    const payload = verifyAccessToken(header.slice('Bearer '.length).trim());
	    const user = await UserModel.findById(payload.sub);
	    if (user && user.status === 'active') {
	      	req.user = { id: user.id, role: user.role, operator_id: user.operator_id ?? null, email: user.email };
	    }
	} catch {
	    // Invalid/expired token on an optional-auth route — proceed as anonymous
	    // rather than failing the request.
	}
	next();
});