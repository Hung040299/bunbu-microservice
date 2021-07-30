const express = require('express');

const app = express();
const Model = require('../model/skill');

const db = new Model();
app.use(express.json());

module.exports = {
  createSkill: async (req, res) => {
    const entity = { ...req.body };
    const skill = await db.createSkill(entity);
    if (skill) {
      res.status(200).send({
        message: 'create successfully',
        skill_name: skill.skill_name,
      });
    } else {
      res.send({ message: 'false' });
    }
  },

  findAllSkill: async (req, res) => {
    const skill = await db.findAllSkill();
    if (skill) {
      res.status(200).json(skill);
    } else {
      res.send({ message: 'There is no skill to display' });
    }
  },

  findSkillById: async (req, res) => {
    const { skill_id } = req.params;
    const skill = await db.findSkillById(skill_id);
    if (skill) {
      res.status(200).send({
        skill_name: skill.skill_name,
      });
    } else {
      res.send({ message: 'error' });
    }
  },

  editSkill: async (req, res) => {
    const { skill_id } = req.params;
    const entity = { ...req.body };
    const skill = await db.editSkill(skill_id, entity);
    if (skill) {
      res.status(200).send({
        message: 'ok',
        skill_name: skill.skill_name,
      });
    } else {
      res.send({
        message: 'edit false',
      });
    }
  },

  deleteSkill: async (req, res) => {
    const { skill_id } = req.params;
    const skill = await db.deleteSkill(skill_id);
    if (skill) {
      res.status(200).send({
        message: 'deleted successfully',
      });
    } else {
      res.send({
        message: 'Could not find a skill to delete',
      });
    }
  },
};
