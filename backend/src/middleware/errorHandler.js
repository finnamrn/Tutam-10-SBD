const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      error: 'Duplicate entry',
      message: err.detail,
    });
  }

  if (err.code === '23502') {
    return res.status(400).json({
      success: false,
      error: 'Missing required field',
      message: err.detail,
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
