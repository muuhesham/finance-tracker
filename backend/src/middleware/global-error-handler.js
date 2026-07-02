export function errorHandler(error, _request, response, _next) {
  const statusCode = error.statusCode || 500;
  const message = statusCode.startsWith('4') ? error.message : 'Internal server error';

  response.status(statusCode).json({ message });
}
