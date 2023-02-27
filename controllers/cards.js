/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
const Movie = require('../models/movie');
const {
  ValidationError,
  NotFoundError,
  AuthorizationError,
  RightsError,
} = require('../constants/errors');
const { decodeToken } = require('../middlewares/auth');

const getAllMovies = async (req, res, next) => {
  console.log(req.user._id);
  const owner = req.user._id;
  try {
    const movies = await Movie.find({ owner });
    return res.status(200).send(movies);
  } catch (e) {
    next(e);
  }
};
const deleteMovie = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new AuthorizationError('Необходима авторизация!!');
  }
  const token = authorization.replace('Bearer ', '');
  try {
    const ownerId = decodeToken(token);
    if (req.user._id !== ownerId._id) {
      throw new RightsError('Невозможно удалить карточку другого пользователя');
    }
    console.log(req.params);
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) {
      throw new NotFoundError('Карточка не найдена');
    }
    return res.status(200).send(movie);
  } catch (e) {
    if (e.name === 'CastError') {
      next(new ValidationError('Данные введены неправильно'));
    }
    next(e);
  }
};
const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create({
      country: req.body.country,
      director: req.body.director,
      duration: req.body.duration,
      year: req.body.year,
      description: req.body.description,
      image: req.body.image,
      trailerLink: req.body.trailerLink,
      thumbnail: req.body.thumbnail,
      nameRU: req.body.nameRU,
      nameEN: req.body.nameEN,
      owner: req.user._id,
      movieId: req.body.movieId,
    });
    if (!movie) {
      throw new NotFoundError('Карточка не найдена');
    }
    return res.status(200).send(movie);
  } catch (e) {
    if (e.name === 'ValidationError') {
      next(new ValidationError('Данные введены неправильно'));
    }
    next(e);
  }
};

module.exports = {
  getAllMovies,
  deleteMovie,
  createMovie,
};
