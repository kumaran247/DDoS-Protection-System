import { Router } from 'express';
import { getAnalyticsData } from '../controllers/analyticsController.js';

const router = Router();

router.get('/', getAnalyticsData);

export default router;
