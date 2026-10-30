/**
 * Production-grade sanitized error handler
 * Non-negotiable rule: No stack traces or raw database errors exposed in client responses
 */
function errorHandler(err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  console.error(`[SERVER ERROR] ${req.method} ${req.path}:`, err.message);
  if (!isProd && err.stack) {
    console.error(err.stack);
  }

  // Sanitized user-safe message
  let userMessage = err.message || 'An unexpected internal error occurred';
  if (isProd && statusCode === 500) {
    userMessage = 'An internal server error occurred. Our technical staff has been notified.';
  }

  return res.status(statusCode).json({
    error: userMessage,
    status: statusCode,
    path: req.path,
    timestamp: new Date().toISOString()
  });
}

module.exports = errorHandler;

