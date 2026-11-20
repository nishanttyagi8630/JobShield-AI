export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`❌ [Error Handler] ${req.method} ${req.url} -> [${statusCode}]:`, err);

  return res.status(statusCode).json({
    success: false,
    error: err.name || 'ServerError',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

export function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    error: 'NotFound',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
}
