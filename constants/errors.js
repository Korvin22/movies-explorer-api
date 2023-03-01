/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class WrongData extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

class DefaultError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class RightsError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = {
  NotFoundError, ValidationError, WrongData, DefaultError, AuthorizationError, RightsError,
};
