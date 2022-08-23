const User = require('../models/user');

const incorrectDataErrorStatus = 400;
const objectNotFoundErrorStatus = 404;
const defaultErrorStatus = 500;
const defaultErrorMessage = "На сервере произошла ошибка";


module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ users }))
    .catch(err => res.status(defaultErrorStatus).send({ message: defaultErrorMessage }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user =>{
      if(user === null) {
        res.status(objectNotFoundErrorStatus).send({ message: "Пользователь по указанному _id не найден" })
      } else res.send({ user })
    })
    .catch(err => {
      if (err.name === "CastError") {
        res.status(incorrectDataErrorStatus).send({ message: "Некорекктный _id пользователя" })
      } else res.status(defaultErrorStatus).send({ message: defaultErrorMessage })
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ user }))
    .catch(err => {
      if (err.name === "ValidationError") {
        res.status(incorrectDataErrorStatus).send({ message: "Переданы некорректные данные при создании пользователя" })
      } else res.status(defaultErrorStatus).send({ message: defaultErrorMessage })
    });
};

module.exports.patchProfile = (req, res) => {
  const { name, about } = req.body
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then(user => res.send({ user }))
    .catch(err => {
      if (err.name === "CastError") {
        res.status(objectNotFoundErrorStatus).send({ message: "Пользователь по указанному _id не найден" })
      }
      else if (err.name === "ValidationError") {
        res.status(incorrectDataErrorStatus).send({ message: "Переданы некорректные данные при обновлении профиля" })
      } else res.status(defaultErrorStatus).send({ message: defaultErrorMessage })
    });
}

module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then(user => res.send({ user }))
    .catch(err => {
      if (err.name === "CastError") {
        res.status(objectNotFoundErrorStatus).send({ message: "Пользователь по указанному _id не найден" })
      }
      else if (err.name === "ValidationError") {
        res.status(incorrectDataErrorStatus).send({ message: "Переданы некорректные данные при обновлении аватара" })
      } else res.status(defaultErrorStatus).send({ message: defaultErrorMessage })
    });
}