/* eslint-disable no-unused-vars */
require('dotenv').config();
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const routerUsers = require('./routes/users');
const routerMovies = require('./routes/movies');
const indexRoutes = require('./routes/index');
const errorHandler = require('./middlewares/handler');

const { NODE_ENV, BASE_URL } = process.env;
const {
  NotFoundError,
} = require('./constants/errors');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const {
  createUser, login,
} = require('./controllers/users');
const { checkAuth } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const PORT = 3000;

const app = express();
// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'localhost:3000',
  'localhost:3001',
  'https://diplomagud.nomoredomains.rocks/',
];

app.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', '*');
  }

  next();
});

app.use(helmet());
app.use(limiter);
/* app.use(express.static(path.join(__dirnamey, 'public'))); */
app.use(bodyParser.json());
app.use(requestLogger);
app.use('/', indexRoutes);
app.use(errorLogger);
app.use(errors()); // обработчик ошибок celebrate
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  errorHandler(err, req, res, next);
});

routerUsers.use((req, res) => { throw new NotFoundError('Роут не найден'); });
routerMovies.use((req, res) => { throw new NotFoundError('Роут не найден'); });
mongoose.connect(NODE_ENV === 'production' ? BASE_URL : 'dev-secret', {
  useNewUrlParser: true,
}, () => {
  console.log('base are connected');
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});
