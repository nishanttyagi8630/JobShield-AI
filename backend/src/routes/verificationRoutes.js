import { Router } from 'express';
import { verificationController } from '../controllers/verificationController.js';

const router = Router();

router.post('/verify-company', verificationController.verify);

export default router;
