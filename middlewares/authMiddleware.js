const jwt = require('jsonwebtoken');
const ApiError = require('../utils/errorHandler');

function authenticateToken(req, res, next) {
  try {
    const cookieToken = req.cookies?.token;
    const authHeader = req.headers['authorization'];
    const headerToken = authHeader && authHeader.split(' ')[1];

    const acess_token = cookieToken || headerToken;

    if (!acess_token) {
      return next(
        new ApiError('Acess_token não fornecido.', 401, {
          acess_token: 'Acess_token nao fornecido',
        })
      );
    }

    jwt.verify(acess_token, process.env.JWT_SECRET || 'secret', (err, user) => {
      if (err) {
        return next(
          new ApiError('Acess_token inválido ou expirado.', 401, {
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
