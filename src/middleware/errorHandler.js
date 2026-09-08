/**
 * Central error handling middleware.
 * Returns consistent JSON response for all application errors.
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error] ${err.message}`);
    if (statusCode === 500) {
      console.error(err.stack);
    }
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
