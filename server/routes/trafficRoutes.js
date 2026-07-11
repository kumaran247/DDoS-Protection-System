import { Router } from 'express';
import {
  simulateNormal,
  simulateAttack,
  stopTraffic,
  getTrafficState,
  getTrafficLogs,
  getRateLimit,
  deleteTrafficLogs,
} from '../controllers/trafficController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/logs', getTrafficLogs);
router.get('/state', getTrafficState);
router.get('/rate-limit', getRateLimit);
router.post('/normal', simulateNormal);
router.post('/attack', simulateAttack);
router.post('/stop', stopTraffic);
router.delete('/logs', authenticate, authorize('admin'), deleteTrafficLogs);

export default router;
