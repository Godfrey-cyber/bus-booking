import jwt from "jsonwebtoken";
import crypto from 'crypto';

// Access token: short-lived, carries everything a request needs to authorize
// itself WITHOUT a DB round trip (role, operatorId for operator-staff scoping).
// authenticate.js still does one indexed lookup per request.

/*
======================================================== 
				ACCESS/REFRESH TOKEN
======================================================== 
*/
export const createAccessToken = (user) => {
	return jwt.sign(
		{
			sub: user.id,
            role: user.role,
            role_id: user.role_id ?? null,
            operator_id: user.operator_id,
            email: user.email,
		}, 
		process.env.ACCESS_TOKEN_SECRET || "234dfgwewvs5465vs5dfgwewvs5465", 
		{ expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1440m" }
	)
}

// Refresh token: long-lived, deliberately minimal payload (just the subject).
// Its validity is ultimately decided by the `refresh_tokens` table, not the
// JWT signature alone.

export const createRefreshToken = (user) => {
	return jwt.sign(
		{
			sub: user.id
		},
		process.env.REFRESH_TOKEN_SECRET || "2dsfgdf34dfgwdfgewvd65vs5dfgsvsdfg5465",
		{ expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
	)
}

// Verify Access Token
export const verifyAccessToken = (token) => {
  	return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "234dfgwewvs5465vs5dfgwewvs5465");
};

// Verify Refresh Token verifyRefreshToken
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || "2dsfgdf34dfgwdfgewvd65vs5dfgsvsdfg5465");
}

export const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
}


/*
======================================================== 
					EMAIL/PASSWORD VALIDATION 
======================================================== 
*/
// Validate email
export const validateEmail = (email) => {
	let emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

	if (!email.match(emailFormat)) {
	    throw new Error( "❌ Please enter a valid email address❗")
	}
}

// Validate password
export const validatePassword = (password) => {
	let passValid=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

	if (!password.match(passValid)) {
	    throw new Error("🚫 Password must be between 8 to 15 characters containing at least one lowercase letter, one uppercase letter, one numeric digit, and one special character" )
	}
}

/*
======================================================== 
		AUTOMATIC BOOKING REFERENCE GENERATOR 
======================================================== 
*/
export const generateBookingReference = () => {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";

	let randomPart = "";

	for (let i = 0; 1 < 6; i++) {
		randomPart += characters.charAt(Math.floor(Math.random() * characters.length))
	}
	return `BK-${randomPart}`;
}