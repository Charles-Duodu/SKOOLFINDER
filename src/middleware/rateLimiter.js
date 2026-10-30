/**
 * In-memory sliding window rate limiter
 */
const requestCounts = new Map();

function rateLimit({ windowMs = 60 * 1000, max = 60, message = 'Too many requests, please try again later.' } = {}) {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }

    const timestamps = requestCounts.get(ip).filter(timestamp => now - timestamp < windowMs);
    timestamps.push(now);
    requestCounts.set(ip, timestamps);

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - timestamps.length));

    if (timestamps.length > max) {
      return res.status(429).json({
        error: message,
        retryAfterSeconds: Math.ceil((windowMs - (now - timestamps[0])) / 1000)
      });
    }

    next();
  };
}

module.exports = {
  rateLimit,
  // Sensitive endpoints: 15 requests per minute
  strictLimiter: rateLimit({ windowMs: 60 * 1000, max: 20, message: 'Rate limit exceeded for security-sensitive endpoint.' }),
  // General API: 100 requests per minute
  standardLimiter: rateLimit({ windowMs: 60 * 1000, max: 120, message: 'Too many requests from this IP address.' })
};

