import express from 'express';
import { getDashboard } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboard);

export default router;
