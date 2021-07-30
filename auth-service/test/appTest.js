const express = require('express');

require('dotenv').config();

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

process.env.NODE_ENV = 'test';
const router = require('../router/Router');

app.use('/', router);

module.exports = app;
