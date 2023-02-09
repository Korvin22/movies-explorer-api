/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
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
  likes: {
    type: [mongoose.ObjectId],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const cardModel = mongoose.model('card', cardSchema);

module.exports = cardModel;
