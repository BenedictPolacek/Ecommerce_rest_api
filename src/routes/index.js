import { Router } from 'express';

const router = Router();

// Base API health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Ecommerce REST API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
