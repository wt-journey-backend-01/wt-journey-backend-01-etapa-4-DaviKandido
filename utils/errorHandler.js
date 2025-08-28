class ApiError extends Error {
  constructor(message, statusCode, errors) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

module.exports = ApiError;
