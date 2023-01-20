/* eslint-disable consistent-return */
/* eslint-disable linebreak-style */
// eslint-disable-next-line import/newline-after-import
const jwt = require('jsonwebtoken');
const secretOrPrivateKey = '597f87d693fa90f156245a03730fe5adaa0b4b9ced59b43c22f69de29ba07337';
const { AuthorizationError } = require('../constants/errors');

function generateToken(payload) {
  return jwt.sign(payload, secretOrPrivateKey);
}

function checkToken(token) {
  if (!token) {
    return false;
  }
  return jwt.verify(token, secretOrPrivateKey, { expiresIn: '7d' });
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
    payload = jwt.verify(token, '597f87d693fa90f156245a03730fe5adaa0b4b9ced59b43c22f69de29ba07337');
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
