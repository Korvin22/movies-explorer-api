/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable linebreak-style */
// eslint-disable-next-line import/newline-after-import
const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;

const { AuthorizationError } = require('../constants/errors');

function generateToken(payload) {
  return jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
}

function checkToken(token) {
  if (!token) {
    return false;
  }
  return jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
}

function decodeToken(token) {
  if (!token) {
    return false;
  }
  return jwt.decode(token);
}

function checkAuth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new AuthorizationError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new AuthorizationError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
}

module.exports = {
  generateToken,
  checkToken,
  checkAuth,
  decodeToken,
};
