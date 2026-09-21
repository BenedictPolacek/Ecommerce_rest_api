import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import categoryRoutes from '../modules/categories/category.routes.js';

const router = Router();

// Base API health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Ecommerce REST API is running',
    timestamp: new Date().toISOString(),
  });
});

// Feature modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);

export default router;

