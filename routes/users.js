const router = require('express').Router();
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers, getUser, createUser, updateUser, getCurrentUser,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/me', getCurrentUser);
router.get('/:id', celebrate({
  body: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUser);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
  }),
}), createUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
    password: Joi.string(),
  }),
}), updateUser);

router.use(errors()); // обработчик ошибок celebrate
module.exports = router;
