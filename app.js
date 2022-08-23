const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {});


app.use((req, res, next) => {
  req.user = {
    _id: '62ff9af7463011425be7173e'
  };

  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.use((req,res,next) => {
	res.status(404).send({message: "Данный запрос не существует"});
});
app.listen(PORT, () => {
  console.log('Ссылка на сервер');
});