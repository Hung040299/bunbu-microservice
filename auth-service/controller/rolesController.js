const express = require('express');

const app = express();
const Model = require('../model/roles');

const db = new Model();
app.use(express.json());

module.exports = {
  createRoles: async (req, res) => {
    const entity = { ...req.body };
    const roles = await db.createRole(entity);
    res.status(200).send({
      message: 'OK',
      roles_name: roles.roles_name,
    });
  },

  getByRole: async (req, res) => {
    const { roles_id } = req.params;
    const role = await db.findByRole(roles_id);
    if (roles_id) {
      res.status(200).send({
        message: 'successfully',
        roles_name: role.roles_name,
      });
    } else {
      res.send({ message: 'role could not be found' });
    }
  },
};
