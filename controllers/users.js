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

const createUser = async (req, res, next) => {
  try {
    console.log(req);
    const body = { ...req.body };
    const { name, email, password } = body;
    console.log(body, 0);
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    console.log(user, 1);
    return res.status(200).send({ _id: user._id });
  } catch (e) {
    console.log(e);
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      next(new ValidationError('Данные введены не корректно'));
      return;
    }
    /* ошибку прописал, но при одинаковом email ee не ловит, не могу понять почему */
    if (e.code === 11000) {
      next(new WrongData('Почта или пароль введены не верно'));
      return;
    }
    next(e);
  }
};

const updateUser = async (req, res, next) => {
  console.log(req.body, 1);
  try {
    const newUser = await User.findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, email: req.body.email },
      { new: true, runValidators: true }
    );
    return res.status(200).send(newUser);
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
  const { name, email, password } = body;
  console.log(body, 1);
  try {
    const user = await User.findOne({ name, email }).select('+password');
    if (!user) {
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
