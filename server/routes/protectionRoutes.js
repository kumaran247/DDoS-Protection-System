import { Router } from 'express';
import {
  getBlockedIps,
  blockIp,
  unblockIp,
  getFirewallRules,
  addFirewallRule,
  deleteFirewallRule,
  verifyCaptcha,
} from '../controllers/protectionController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/blocked-ips', getBlockedIps);
router.get('/firewall', getFirewallRules);
router.post('/captcha', verifyCaptcha);
router.post('/block-ip', authenticate, authorize('admin'), blockIp);
router.delete('/block-ip/:ip', authenticate, authorize('admin'), unblockIp);
router.post('/firewall', authenticate, authorize('admin'), addFirewallRule);
router.delete('/firewall/:id', authenticate, authorize('admin'), deleteFirewallRule);

export default router;
