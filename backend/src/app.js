import express from 'express';
import helmet from 'helmet';
import { configureCORS } from './middleware/corsConfig.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS middleware
app.use(configureCORS());

// Body parsing with safe size limits
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// General rate limiter on API surface
app.use('/api', apiLimiter);

// API route mount
app.use('/api', apiRoutes);

// Root greeting / health redirect
app.get('/', (req, res) => {
  res.json({
    name: 'JobShield AI Backend Service',
    description: 'AI-Powered Fake Job & Internship Scam Detection API',
    documentation: '/api/health',
    status: 'online'
  });
});

// Centralized 404 & error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
