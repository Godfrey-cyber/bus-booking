import express from 'express';
import { 
  createDestination, 
  getOperatorDestinations 
} from '../controllers/destinations.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
// import { 
//   createDestinationValidation, 
//   listDestinationsValidation 
// } from '../middleware/destinationValidators.js';
const router = express.Router();

// Apply auth middleware globally to all destination endpoints
router.use(authenticate);

// Enforce operator role requirement for all destination management
// router.use(authorize('operator'));

// Route 1: Create a new destination
router.post(
  	'/new-destination',
  	authorize('operator'),
  	createDestination
);

// Route 2: Get all operator destinations
router.get(
  	'/all-destinations',
  	authorize('operator'),
  	getOperatorDestinations
);

export default router;