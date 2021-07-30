const model = require('../models/login.model')
const db = new model.model()
const jwtservice =require('../config/jwt.service')
require('dotenv').config()
require('../services/facebook')
require('../services/google')
let token

module.exports = {
  logIn: async (req, res) => {
    const { email, password, remember_me } = req.body
    await db.logIn(email, password, (token) => {
      if (token) {
        if (remember_me) {
          res.setHeader('Cache-Control', `public, max-age = ${process.env.MAX_AGE_REMEMBER_ME}`);
          res.setHeader('x-access-token', token)
          return res.status(200).send(token)
        }
        else {
          res.setHeader('Cache-Control', `public, max-age = ${process.env.MAX_AGE_NOT_REMEMBER_ME}`);
          res.setHeader('x-access-token', token)
          return res.status(200).send(token)
        }
      }
      else {
        return res.status(401).send({ message: 'Login fail' })
      }
    })
  },
  facebookCallback: async (req, res) => {
    const account = await model.getByEmail(req.user.emails[0].value)
    token = jwtservice.sign({account_id: account.account_id})
    res.setHeader('x-access-token', token)
    res.send('Login with facebook success')
  },
  googleCallback: async (req, res) => {
    const account = await model.getByEmail(req.user.emails[0].value)
    token = jwtservice.sign({account_id: account.account_id})
    res.setHeader('x-access-token', token)
    res.send('Login with google success')
  },
  resetPassword: async (req, res) => {
    const { email } = req.body
    const result = await db.resetPassword(email)
    if(result){
      res.send('The new password has been sent to your email')
    }
    else{
      res.send('Email is not valid')
    }
  }
}
