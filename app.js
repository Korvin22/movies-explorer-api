/* eslint-disable no-unused-vars */
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
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
const allowedCors = ['http://localhost:3000',
  'https://diplomagud.nomoredomains.rocks',
  'http://diplomagud.nomoredomains.rocks',
  'http://diplomagud.nomoredomains.work',
  'https://diplomagud.nomoredomains.work',
];
const corsOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'Accept', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));
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
  console.log(err);
  errorHandler(err, req, res, next);
});

routerUsers.use((req, res) => { throw new NotFoundError('Роут не найден'); });
routerMovies.use((req, res) => { throw new NotFoundError('Роут не найден'); });
mongoose.connect(NODE_ENV === 'production' ? BASE_URL : 'dev-secret', {
  useNewUrlParser: true,
}, (err) => {
  if (err) console.log(err);
  else console.log('mongdb is connected');
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});
