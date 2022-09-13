const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, Joi, celebrate } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorsHandler = require('./middlewares/errorsHandler');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {});

// роуты, не требующие авторизации
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

// обработчик ошибок celebrate
app.use(errors());

// обработка ошибок
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
});
