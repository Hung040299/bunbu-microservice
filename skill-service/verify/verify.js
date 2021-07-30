require('dotenv').config();
const jwt = require('jsonwebtoken');
const channel = require('../rabbitmq/channelCreator')
const axios = require('axios')

let obj = {
  user_id: 0,
  role: 0,
  set: function setId(id, role) {
    this.user_id = id
    this.role = role
  },
}

module.exports = {
  verify: async (req, res, next) => {
    const token = req.header('access_token');
    if (token) {
      await axios.get('http://localhost:7000/consumeAuthReq')

      channel.channel.assertExchange('authExchange', 'direct', { durable: false })
      channel.channel.assertQueue('authQueue', {
        durable: false
      });
      channel.channel.bindQueue('authQueue', 'authExchange', 'test');
      channel.channel.publish('authExchange', 'test', Buffer.from(token.toString()))
      
      channel.channel.assertExchange('resendExchange', 'direct', { durable: false })
      channel.channel.assertQueue('resendQueue', {
        durable: false
      }, (err, q) => {
        if (err) throw err
        console.log(q)
        channel.channel.bindQueue(q.queue, 'resendExchange', 'key');
        channel.channel.consume(q.queue, (msg) => {
          let data = JSON.parse(msg.content.toString())
          console.log(data)
          obj.set(data.id, data.role)
        }, { noAck: true })
      })
      req.user_id = obj.user_id
      req.role = obj.role
      return next();
    }
    else {
      obj.set(0, 0)
      return next();
    }
  },
  
  requireAdmin: async (req, res, next) => {
    const { user_id } = obj;
    console.log(obj)
    if (!user_id) {
      return res.status(401).send({ message: 'access denied' });
    }
    if (req.role === 1) {
      return next();
    }

    return res.status(401).send({ message: 'access denied' });
  },
  requireUser: async (req, res, next) => {
    const { user_id } = obj;
    if (!user_id) {
      return res.status(401).send({ message: 'access denied' });
    }
    if (obj.role === 2) {
      return next();
    }

    return res.status(401).send({ message: 'access denied' });
  },
  requireAdminOrHr: async (req, res, next) => {
    const { user_id } = obj;
    if (!user_id) {
      return res.status(401).send({ message: 'access denied' });
    }
    if (obj.role === 1) {
      return next();
    }
    if (obj.role === 3) {
      return next();
    }

    return res.status(401).send({ message: 'access denied' });
  },

  requireCurrent: async (req, res, next) => {
    const { user_id } = req.params;
    if (!obj.user_id) {
      return res.status(401).send({ message: 'access denied' });
    }
    if (obj.role === 2) {
      if (user_id === req.user_id) {
        return next();
      }

      return res.status(401).send({ message: 'access denied' });
    }
    return next();
  },

};
