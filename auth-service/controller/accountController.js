const express = require('express');

const app = express();
const bcrypt = require('bcrypt');
const Model = require('../model/user');

const db = new Model();

app.use(express.json());

module.exports = {
  createAccount: async (req, res) => {
    const entity = { ...req.body };
    const email = await db.findByEmail(entity.user_email);
    if (email) {
      res.send({
        message: 'Email already exists',
      });
    } else {
      entity.user_password = bcrypt.hashSync(entity.user_password, 6);
      const account = await db.createAccount(entity);
      res.status(200).send({
        message: 'ok',
        user_id: account.account.user_id,
        user_email: account.account.user_email,
        profile_phone: account.userProfile.profile_phone,
      });
    }
  },

  listAccount: async (req, res) => {
    const { role_id } = req.params;
    const users = await db.getlistAccount(role_id);
    if (users) {
      res.status(200).json(users);
    } else {
      res.send({ message: 'Access is not allowed' });
    }
  },

  getByEmail: async (req, res) => {
    const { user_email } = req.body;
    const user = await db.findByEmail(user_email);
    if (user) {
      res.status(200).send({
        message: 'ok',
        user_code: user.user_code,
        user_email: user.user_email,
      });
    } else {
      res.send({
        message: 'user not found',
      });
    }
  },

  showAccount: async (req, res) => {
    const { role_id } = req.params;
    const users = await db.getlistAccount(role_id);
    res.json(users.map((item) => ({
      user_id: item.user_id,
      user_code: item.user_code,
      user_email: item.user_email,
    })));
  },

  editUser: async (req, res) => {
    const { user_id } = req.params;
    const entity = { ...req.body };
    if (entity.user_password == null) {
      const user = await db.editAccount(user_id, entity);
      if (user) {
        res.status(200).send({
          message: 'ok',
          user_id: user.user_id,
          user_code: user.user_code,
          user_email: user.user_email,
        });
      } else {
        res.send({
          message: 'edit false',
        });
      }
    }
  },

  deleteUser: async (req, res) => {
    const { user_id } = req.params;
    const user = await db.deleteAccount(user_id);
    if (user) {
      res.status(200).send({
        message: 'deleted successfully',
      });
    } else {
      res.send({
        message: 'Could not find a user to delete',
      });
    }
  },
};
