const express = require('express');

const app = express();
const Model = require('../model/skill_level');

const db = new Model();
app.use(express.json());

module.exports = {
  createLevel: async (req, res) => {
    const entity = { ...req.body };
    const level = await db.createLevel(entity);
    if (level) {
      res.status(200).send({
        message: 'create successfully',
        level_name: level.level_name,
      });
    } else {
      res.send({ message: 'error' });
    }
  },
};
