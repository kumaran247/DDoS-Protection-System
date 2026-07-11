import { Router } from 'express';
import { getDetectionStatus, runDetection } from '../controllers/detectionController.js';

const router = Router();

router.get('/status', getDetectionStatus);
router.post('/analyze', runDetection);

export default router;
