import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getCart,
  updateCart,
} from '../controllers/cart.controller.js';

const router = express.Router();

router.get('/', protect, getCart);
router.post('/', protect, updateCart);

export default router;
