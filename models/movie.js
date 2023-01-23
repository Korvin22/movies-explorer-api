/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    required: true,
    type: String,
  },
  director: {
    required: true,
    type: String,
  },
  duration: {
    required: true,
    type: Number,
  },
  year: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  image: {
    required: true,
    type: String,
    validate: {
      validator(v) {
        return /https?[www.]?[a-z[\]@!$&'()*+,;=-]*/.test(v);
      },
    },
  },
  trailerLink: {
    required: true,
    type: String,
    validate: {
      validator(v) {
        return /https?[www.]?[a-z[\]@!$&'()*+,;=-]*/.test(v);
      },
    },
  },
  thumbnail: {
    required: true,
    type: String,
    validate: {
      validator(v) {
        return /https?[www.]?[a-z[\]@!$&'()*+,;=-]*/.test(v);
      },
    },
  },
  owner: {
    type: mongoose.ObjectId,
    required: true,

  },
  movieId: {
    type: Number,
    required: true,

  },
  nameRU: {
    type: String,
    required: true,

  },
  nameEN: {
    type: String,
    required: true,

  },
});

const movieModel = mongoose.model('movie', movieSchema);
module.exports = movieModel;
