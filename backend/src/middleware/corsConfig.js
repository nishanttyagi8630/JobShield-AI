import cors from 'cors';
import { config } from '../config/env.js';

export function configureCORS() {
  const allowedOrigins = [
    config.frontendUrl,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://localhost:4173'
  ];

  return cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman, automated tests)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in development for local testing
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
  });
}
