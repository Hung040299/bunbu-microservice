const express = require('express');

const app = express();
const bcrypt = require('bcrypt');
const Model = require('../model/user');

const db = new Model();
app.use(express.json());

module.exports = {
  showProfile: async (req, res) => {
    const profile = await db.findById(req.user_id);
    if (profile) {
      res.status(200).send({
        message: 'ok',
        avatar: profile.avatar,
        profile_phone: profile.profile_phone,
        profile_address: profile.profile_address,
      });
    } else {
      res.send({
        message: 'profile not found',
      });
    }
  },

  changePassword: async (req, res) => {
    const { old_user_password, user_password } = req.body;
    const user = await db.findById(req.user_id);
    if (user) {
      const result = bcrypt.compareSync(old_user_password, user.user_password);
      if (result) {
        const hash = bcrypt.hashSync(user_password, 6);
        await db.editPassword(hash, user.user_email);
        res.status(200).send({
          message: 'ok',
        });
      } else {
        res.send({
          message: 'error',
        });
      }
    } else {
      res.send({
        message: 'error',
      });
    }
  },
};
