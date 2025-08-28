const jwt = require('jsonwebtoken');
const ApiError = require('../utils/errorHandler');

function authenticateToken(req, res, next) {
  try {
    const cookieToken = req.cookies?.token;
    const authHeader = req.headers['authorization'];
    const headerToken = authHeader && authHeader.split(' ')[1];

    const token = cookieToken || headerToken;

    if (!token) {
      return next(
        new ApiError('Token não fornecido.', 401, {
          acess_token: 'Token nao fornecido',
        })
      );
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
      if (err) {
        return next(
          new ApiError('Token inválido ou expirado.', 401, {
            acess_token: err.message,
          })
        );
      }

      req.user = user;
      next();
    });
  } catch (error) {
    return next(new ApiError('Error authenticating user', 401, error.message));
  }
}

module.exports = { authenticateToken };
