/* eslint-disable no-unused-vars */
require('dotenv').config();
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const routerUsers = require('./routes/users');
const routerMovies = require('./routes/movies');
const {
  NotFoundError,
} = require('./constants/errors');

const {
  createUser, login,
} = require('./controllers/users');
const { checkAuth } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

console.log(process.env.NODE_ENV);
const PORT = 3000;
const app = express();
app.use(helmet());
/* app.use(express.static(path.join(__dirnamey, 'public'))); */
app.use(bodyParser.json());
app.use(requestLogger);
app.use('/users', checkAuth, routerUsers);
app.use('/movies', checkAuth, routerMovies);
app.post('/signin', login);
app.post('/signup', createUser);
app.use(errorLogger);
app.use(errors()); // обработчик ошибок celebrate
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  return next();
});

routerUsers.use((req, res) => { throw new NotFoundError('Роут не найден'); });
routerMovies.use((req, res) => { throw new NotFoundError('Роут не найден'); });
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
}, () => {
  console.log('base are connected');
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});
