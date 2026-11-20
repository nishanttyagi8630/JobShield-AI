import { Router } from 'express';
import analysisRoutes from './analysisRoutes.js';
import verificationRoutes from './verificationRoutes.js';
import healthRoutes from './healthRoutes.js';

const router = Router();

router.use(healthRoutes);
router.use(analysisRoutes);
router.use(verificationRoutes);

export default router;
