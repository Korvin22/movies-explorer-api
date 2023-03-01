/* eslint-disable linebreak-style */
/* eslint-disable comma-dangle */
/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const User = require('../models/user');

const {
  ValidationError,
  NotFoundError,
  WrongData,
  AuthorizationError,
  DefaultError
} = require('../constants/errors');

const {
  generateToken
} = require('../middlewares/auth');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (e) {
    next(e);
  }
};
const getUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (!user) {
      throw new NotFoundError('пользователь не найден');
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      next(new ValidationError('Данные введены неправильно'));
    }
    if (e.name === 'CastError') {
      next(new ValidationError('Данные введены неправильно'));
    }
    next(e);
  }
};

const getCurrentUser = async (req, res, next) => {
  console.log(req.user._id);
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      next(new ValidationError('Данные введены не корректно'));
    }
    if (e.name === 'CastError') {
      next(new ValidationError('Данные введены не корректно'));
    } next(e);
  }
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name,
            email,
            password: hash,
          }))
          .then(() => res.status(201).send({
            data: {
              name, email,
            },
          }))
          .catch((err) => {
            console.log(err);
            if (err.name === 'MongoError' && err.code === 11000) {
              next(new WrongData('Пользователь уже существует'));
            } else {
              next(new DefaultError('Ошибка сервера'));
            }
          });
      } else {
        console.log('111');
        next(new WrongData('Пользователь уже существует'));
      }
    })
    .catch(() => {
      next(new DefaultError('Ошибка сервера'));
    });
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const createdUser = await User.findOne({ email });
    const user = await User.findById(req.user._id);
    if (createdUser && email !== user.email) {
      console.log(email !== user.email);
      throw new WrongData('такой email уже зарегистрирован');
    } else {
      const newUser = await User.findByIdAndUpdate(
        req.user._id,
        { name, email },
        { new: true, runValidators: true }
      );
      if (!newUser) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      } else {
        console.log(newUser);
        res.status(200).send(newUser);
      }
    }
  } catch (e) {
    console.log(req.body, 2);
    if (e.name === 'ValidationError') {
      console.log(req.body, 1);
      next(new ValidationError('Данные введены не корректно'));
      return;
    } next(e);
  }
};

const login = async (req, res, next) => {
  const body = { ...req.body };
  const { email, password } = body;
  console.log(body, 1);
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('нет пользователя');
      throw new AuthorizationError('Неверные логин или пароль');
    }
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const payload = { _id: user._id };
      const token = generateToken(payload);
      return res.status(200).json({ token });
    }
  } catch (e) {
    console.log(body, 2);
    console.log(322222222, e.name);
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      console.log(body, 3);
      next(new ValidationError('Данные введены не корректно'));
      return;
    }
    next(e);
  }
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  login,
  getCurrentUser,
};
