import { Router } from 'express';
import { analysisController } from '../controllers/analysisController.js';
import { validateAnalysisInput } from '../validators/analysisValidator.js';
import { analyzeLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/analyze', analyzeLimiter, validateAnalysisInput, analysisController.analyze);
router.get('/analyses', analysisController.getAll);
router.get('/analyses/:id', analysisController.getById);
router.delete('/analyses/:id', analysisController.deleteById);
router.get('/stats', analysisController.getStats);

export default router;
