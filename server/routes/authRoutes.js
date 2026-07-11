import { Router } from 'express';
import { login, register, getProfile, getUsers, deleteUser } from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/profile', authenticate, getProfile);
router.get('/users', authenticate, authorize('admin'), getUsers);
router.delete('/users/:id', authenticate, authorize('admin'), deleteUser);

export default router;
