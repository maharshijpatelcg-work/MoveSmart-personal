// MoveSmart — Safety Routes
import { Router } from 'express';
import { triggerSOS, getSafetyEvents, shareLocation } from '../controllers/safetyController.js';
import protect from '../middleware/auth.js';

const router = Router();

router.post('/sos', protect, triggerSOS);
router.post('/share-location', protect, shareLocation);
router.get('/events', protect, getSafetyEvents);

export default router;
