const express = require('express');

require('dotenv').config();

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = require('./router/Router');

app.use('/', router);

app.listen(8001, () => {
  console.log('Skill - 8001')
});

module.exports = app;
