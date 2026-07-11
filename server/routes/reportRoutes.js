import { Router } from 'express';
import {
  getReportData,
  getCsvReport,
  getNotifications,
  markNotificationRead,
  clearNotifications,
} from '../controllers/reportController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/data', getReportData);
router.get('/csv', getCsvReport);
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);
router.delete('/notifications', authenticate, authorize('admin'), clearNotifications);

export default router;
