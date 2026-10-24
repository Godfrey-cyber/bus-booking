import { AppError } from '../utilities/AppError.js';
import { asyncHandler } from '../utilities/asyncHandler.js';
import { BookingModel } from '../models/Booking.js';

/**
 * Generic ownership guard. Loads a resource, confirms the authenticated user
 * is allowed to touch it, and attaches it to `req.resource` so the controller
 * that runs next never has to fetch it a second time.
 *
 * Must run after `authenticate` (and typically after `authorize`).
 *
 * Security note: a failed ownership check returns 404, not 403. Returning 403
 * confirms to an attacker that booking #4821 exists and belongs to someone
 * else — 404 reveals nothing beyond "you can't reach anything at this URL."
 * Admins always pass, regardless of `ownerCheck`.
 *
 * @param {Object} config
 * @param {string} config.resourceName - used in the 404 message, e.g. 'Booking'
 * @param {(req) => Promise<object|null>} config.fetchResource - loads the row
 * @param {(resource, user) => boolean} config.ownerCheck - true if user owns it
 */

export const requireOwnership = ({ resourceName = 'Resource', fetchResource, ownerCheck }) =>
	asyncHandler(async (req, res, next) => {
	    if (!req.user) {
	      throw new AppError('Authentication required before ownership can be checked.', 401, 'AUTH_REQUIRED');
	    }

	    const resource = await fetchResource(req);
	    if (!resource) {
	      throw new AppError(`${resourceName} not found.`, 404, 'RESOURCE_NOT_FOUND');
	    }

	    if (req.user.role === 'admin') {
	      req.resource = resource;
	      return next();
	    }

	    if (!ownerCheck(resource, req.user)) {
	      throw new AppError(`${resourceName} not found.`, 404, 'RESOURCE_NOT_FOUND');
	    }

	    req.resource = resource;
	    next();
	});

	  /**
	 * Preset: a booking belongs to the passenger who made it.
	 * Reads the id from `req.params.id` — use `requireOwnership` directly if your
	 * route names the param something else (e.g. `:bookingId`).
	 *
	 *   router.get('/booking/:id', authenticate, ownsBooking, bookingController.getOne)
	 *   // controller can then just do: res.json({ data: req.resource })
	 */
	export const ownsBooking = requireOwnership({
	  	resourceName: 'Booking',
	  	fetchResource: (req) => BookingModel.findById(req.params.id),
	  	ownerCheck: (booking, user) => booking.user_id === user.id,
	});

	/**
	 * Preset factory: a fleet resource (bus, route, schedule, driver, trip)
	 * belongs to the operator company the requesting operator_staff user works
	 * for — comparing `resource.operator_id` against `req.user.operatorId`, not
	 * against `req.user.id`. Any model passed in just needs a `findById(id)`.
	 *
	 *   router.patch('/bus/:id', authenticate, authorize('operator_staff'),
	 *     ownsOperatorResource(BusModel, 'Bus'), busController.update)
	 */
	export const ownsOperatorResource = (model, resourceName = 'Resource') =>
		requireOwnership({
	    	resourceName,
	    	fetchResource: (req) => model.findById(req.params.id),
	    	ownerCheck: (resource, user) => user.operatorId !== null && resource.operator_id === user.operatorId,
	});

	/**
	 * Preset: the URL param must match the requesting user's own id — for routes
	 * like `/users/:id/profile` where a passenger should only ever read/edit
	 * their own record (admins still pass via the base `requireOwnership` check).
	 */
	export const isSelf = (paramName = 'id') => (req, res, next) => {
		if (!req.user) {
	    	return next(new AppError('Authentication required.', 401, 'AUTH_REQUIRED'));
		}
		if (req.user.role === 'admin') return next();

	  // Loose equality: URL params arrive as strings, ids may be numeric.
		if (String(req.params[paramName]) !== String(req.user.id)) {
		    // 404 here too, for the same reason as requireOwnership above.
		    return next(new AppError('Not found.', 404, 'RESOURCE_NOT_FOUND'));
		}
	next();
	};