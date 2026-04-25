// MoveSmart — Route Routes
import { Router } from 'express';
import { getRoutes, createRoute, getRoute } from '../controllers/routeController.js';
import protect from '../middleware/auth.js';

const router = Router();

router.get('/', getRoutes);
router.post('/', protect, createRoute);
router.get('/:id', getRoute);

export default router;
