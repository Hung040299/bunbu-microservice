const express = require('express');
const app = require('express')();
const path = require('path');
const route = require('../routes/index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs')
const session = require('express-session');
const { Client } = require('pg');
const { result } = require('lodash');
require('dotenv').config({ path: '' })

const socketio = require('socket.io')
const http = require('http')
const WebSockets = require('../services/websocket')

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const redis = require('redis');
const redisClient = redis.createClient(6379);
const redisStore = require('connect-redis')(session)
redisClient.on('error', (error) => {
  console.log('Redis Error', error)
})
app.use(session({
  secret: process.env.REDIS_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 115000 },
  store: new redisStore({ host: process.env.REDIS_STORE_HOST, port: process.env.REDIS_STORE_PORT, client: redisClient, ttl: process.env.REDIS_STORE_TTL })
}))

route(app)

const server = http.createServer(app);
global.io = socketio(server)
global.io.on('connection', WebSockets.connection)
redisClient.quit()

module.exports = app;
