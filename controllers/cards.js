const Card = require('../models/card');

const incorrectDataErrorStatus = 400;
const objectNotFoundErrorStatus = 404;
const defaultErrorStatus = 500;
const defaultErrorMessage = 'На сервере произошла ошибка';

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(defaultErrorStatus).send({ message: defaultErrorMessage }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(incorrectDataErrorStatus).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else res.status(defaultErrorStatus).send({ message: defaultErrorMessage });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        res.status(objectNotFoundErrorStatus).send({ message: 'Передан несуществующий _id карточки.' });
      } else res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(incorrectDataErrorStatus).send({ message: 'Некорректный _id карточки' });
      } else res.status(defaultErrorStatus).send({ message: defaultErrorMessage });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        res.status(objectNotFoundErrorStatus).send({ message: 'Передан несуществующий _id карточки.' });
      } else res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(incorrectDataErrorStatus).send({ message: 'Некорректный _id карточки' });
      } else if (err.name === 'ValidationError') {
        res.status(incorrectDataErrorStatus).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else res.status(defaultErrorStatus).send({ message: defaultErrorMessage });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        res.status(objectNotFoundErrorStatus).send({ message: 'Передан несуществующий _id карточки.' });
      } else res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(incorrectDataErrorStatus).send({ message: 'Некорректный _id карточки' });
      } else if (err.name === 'ValidationError') {
        res.status(incorrectDataErrorStatus).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else res.status(defaultErrorStatus).send({ message: defaultErrorMessage });
    });
};
