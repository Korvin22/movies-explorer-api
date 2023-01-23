/* eslint-disable linebreak-style */
const router = require('express').Router();
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');

const {
  getAllMovies, createMovie, deleteMovie,
} = require('../controllers/cards');

router.get('/', getAllMovies);
router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
}), deleteMovie);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    trailerLink: Joi.string().required(),
    thumbnail: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
}), createMovie);

router.use(errors()); // обработчик ошибок celebrate
module.exports = router;
