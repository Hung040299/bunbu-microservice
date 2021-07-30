require('dotenv').config()
const jwt = require('jsonwebtoken');
const cvs = require('../models/cv.model')
const cv_model = new cvs()
const channel = require('../services/rabbbitmq')
const axios = require('axios')

let obj = {
  user_id: 0,
  role: 0,
  set: function setId(id, role) {
    this.user_id = id
    this.role = role
  },
}

const sign = (data) => {
  return jwt.sign(data, process.env.SECRET)
}

const verify = async (req, res, next) => {
  const token = req.header('access_token');
    if (token) {
      await axios.get('http://localhost:7000/consumeAuthReqCV')

      channel.channel.assertExchange('authExchange', 'direct', { durable: false })
      channel.channel.assertQueue('authCVQueue', {
        durable: false
      });
      channel.channel.bindQueue('authCVQueue', 'authExchange', 'CvService');
      channel.channel.publish('authExchange', 'CvService', Buffer.from(token.toString()))

      channel.channel.assertExchange('resendExchange', 'direct', { durable: false })
      channel.channel.assertQueue('resendCVQueue', {
        durable: false
      }, (err, q) => {
        if (err) throw err
        console.log(q)
        channel.channel.bindQueue(q.queue, 'resendExchange', 'CvService');
        channel.channel.consume(q.queue, (msg) => {
          let data = JSON.parse(msg.content.toString())
          console.log(data)
          obj.set(data.id, data.role)
        }, { noAck: true })
      })
      req.account_id = obj.user_id
      req.role = obj.role
      return next();
    }
    else {
      obj.set(0, 0)
      return next();
    }
}

const requireAdmin = async (req, res, next) => {
  console.log(req.account_id, req.role)
  if (req.account_id == undefined) {
    return res.status(401).send({ message: 'ACCESS DENIED' })
  }
  if (req.role !== 1) {
    return res.status(401).send({ message: 'ACCESS DENIED' })
  }
  else return next()
}

const requireUser = async (req, res, next) => {
  if (!req.account_id) {
    return res.status(401).send({ message: 'ACCESS DENIED' })
  }
  if (req.role !== 2) {
    return res.status(401).send({ message: 'ACCESS DENIED' })
  }
  else return next()
}

const requireCompany = async (req, res, next) => {
  if (!req.account_id) {
    return res.status(401).send({ message: 'ACCESS DENIED' })
  }
  if (req.role !== 4) {
    return res.status(401).send({ message: 'ACCESS DENIED' })
  }
  else return next()
}

const requireUserOrAdmin = async (req, res, next) => {
  if (!req.account_id) {
    return res.status(401).send({ message: 'ACCESS DENIED' })
  }
  if (req.role === 1) {
    return next()
  }
  if (req.role === 2) {
    const { cvid } = req.params
    const cv = await cv_model.showCV(cvid)
    if (req.account_id == cv.user_role_id) {
      return next()
    }
    else {
      return res.status(401).send({ message: 'ACCESS DENIED' })
    }
  }
  else return next()
}

const requireCompanyOrAdmin = async (req, res, next) => {
  if (!req.account_id) {
    return res.status(401).send({ message: 'ACCESS DENIED' })
  }
  if (req.account_id === 1 || req.account_id === 4) {
    return next()
  }
  else return res.status(401).send({ message: 'ACCESS DENIED' })
}

const requireNotAdmin = async (req, res, next) => {
  if (!req.account_id) {
    return res.status(401).send({ message: 'ACCESS DENIED' });
  }
  if (req.account_id === 2 || req.account_id === 4) {
    return next();
  }
  return res.status(401).send({ message: 'ACCESS DENIED' });
};

const requireUserOrCompany = async (req, res, next) => {
  const { conversation_id } = req.params
  if (!req.account_id) {
    return res.status(401).send({ message: 'ACCESS DEINIED' });
  }
  if (req.account_id === 4) {
    return next();
  }
  if (req.account_id === 2) {
    const userInConversation = await conversation_model.getUserInConversation(conversation_id);
    if (userInConversation.includes(req.account_id)) {
      return next();
    }
    else {
      return res.status(401).send({ message: 'ACCESS DEINIED' });
    }
  }
  return res.status(401).send({ message: 'ACCESS DEINIED' });
}

module.exports = {
  sign, verify, requireAdmin,
  requireUser, requireCompany, requireUserOrAdmin,
  requireCompanyOrAdmin, requireNotAdmin, requireUserOrCompany
}
