const errorHandler = (err, req, res, next) => {
  // If res.status was already set by route code, use it; otherwise default to 500
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  const isProd = process.env.NODE_ENV === 'production';

  // Always log the full error server-side
  console.error(`[ERROR] ${req.method} ${req.originalUrl} → ${statusCode}: ${err.message}`);
  if (!isProd) console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    message: isProd && statusCode === 500
      ? 'Internal server error'   // never leak raw error text in production
      : err.message,
    // Only include stack trace in development
    ...(isProd ? {} : { stack: err.stack }),
  });
};

module.exports = { errorHandler };
