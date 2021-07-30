require('dotenv').config();
const jwt = require('jsonwebtoken');
const Model = require('../model/user');

const db = new Model();
module.exports = {
  sign: (data) => jwt.sign(data, process.env.SECRET),
  verify: (req, res, next) => {
    const token = req.header('access_token');
    if(token){
      let verified = jwt.verify(token, process.env.SECRET);
      if (!verified) return next()
      req.user_id = verified.id
    }
    return next();
  },
  
  requireAdmin: async (req, res, next) => {

    const { user_id } = req;
    if (!user_id) {
      return res.status(401).send({ message: 'access denied' });
    }
    const account = await db.findById(user_id);
    if (account.role_id === 1) {
      return next();
    }

    return res.status(401).send({ message: 'access denied' });
  },
  requireUser: async (req, res, next) => {
    const { user_id } = req;
    if (!user_id) {
      return res.status(401).send({ message: 'access denied' });
    }
    const account = await db.findById(user_id);
    if (account.role_id === 2) {
      return next();
    }

    return res.status(401).send({ message: 'access denied' });
  },

  requireAdminOrHr: async (req, res, next) => {
    const { user_id } = req;
    if (!user_id) {
      return res.status(401).send({ message: 'access denied' });
    }
    const account = await db.findById(user_id);
    if (account.role_id === 1) {
      return next();
    }
    if (account.role_id === 3) {
      return next();
    }

    return res.status(401).send({ message: 'access denied' });
  },

  requireCurrent: async (req, res, next) => {
    const { user_id } = req.params;
    if (!req.user_id) {
      return res.status(401).send({ message: 'access denied' });
    }
    const account = await db.findById(req.user_id);
    if (account.role_id === 2) {
      if (user_id === req.user_id) {
        return next();
      }

      return res.status(401).send({ message: 'access denied' });
    }
    return next();
  },

};
