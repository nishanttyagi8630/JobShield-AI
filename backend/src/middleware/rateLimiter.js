import rateLimit from 'express-rate-limit';

// Standard rate limiter for general API endpoints: 120 requests per 15 minutes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'TooManyRequests',
    message: 'Too many requests from this IP address. Please try again after 15 minutes.'
  }
});

// Stricter rate limiter for AI analysis endpoint to avoid abuse: 30 analyses per 15 minutes
export const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 45,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'TooManyRequests',
    message: 'Analysis quota reached for this window. Please wait a few minutes before analyzing another offer.'
  }
});
