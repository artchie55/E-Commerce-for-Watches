import express from 'express';
import { createProduct, getAllProducts, deleteProduct } from '../controllers/product.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllProducts);
router.post('/', protect, createProduct); // Only logged-in admins can post

router.delete('/:id', protect, deleteProduct);

export default router;
