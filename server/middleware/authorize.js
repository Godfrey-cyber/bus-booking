import { AppError } from '../utilities/AppError.js';

/**
 * 	 Role-based access control. Must run after `authenticate`.
 *
 *   router.post('/bus', authenticate, authorize('operator_staff'), ...)
 *   router.get('/admin/operators', authenticate, authorize('admin'), ...)
 *   router.patch('/booking/:id/cancel', authenticate, authorize(['passenger', 'admin']), ...)
 *
 * `admin` is allowed through by default even when not listed — an admin
 * needing to be explicitly whitelisted on every single route is how RBAC
 * systems quietly rot as new routes get added. Pass `{ allowAdmin: false }`
 * for the rare route that must be off-limits even to admins.
 */

export const authorize = (roles, options = {  }) => {
	const allowedRoles = Array.isArray(roles) ? roles : [roles];
	const { allowAdmin = true } = options;

	return (req, res, next) => {
	    if (!req.user) {
	    	console.log("---user--", req.user)
	    	console.log("---user--", req)
		    return next(new AppError('Authentication required before role can be checked.', 401, 'AUTH_REQUIRED'));
	    }

	    if (allowAdmin && req.user.role === 'Admin') {
	    	return next();
	    }

	    if (!allowedRoles.includes(req.user.role)) {
	      	return next(
	        	new AppError(`This action requires one of the following roles: ${allowedRoles.join(', ')}.`, 403, 'RBAC_FORBIDDEN')
	      	);
	    }
	    next();
	};
};
