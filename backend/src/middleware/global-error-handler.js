export function errorHandler(error, _request, response, _next) {
  const statusCode = error.statusCode || 500;
  const message = (statusCode >= 400 && statusCode < 500) ? error.message : 'Internal server error';

  response.status(statusCode).json({ message });
}
