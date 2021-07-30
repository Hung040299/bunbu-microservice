const express = require('express');

const app = express();
const Model = require('../model/staff_skill');

const db = new Model();
app.use(express.json());

module.exports = {
  createStaffSkill: async (req, res) => {
    const entity = { ...req.body };
    const staffSkill = await db.createStaffSkill(entity);
    if (staffSkill) {
      res.status(200).send({
        message: 'create successfully',
        user_id: staffSkill.user_id,
        skill_id: staffSkill.skill_id,
        level_id: staffSkill.level_id,
      });
    } else {
      res.send({ message: 'error' });
    }
  },

  findAllStaffSkill: async (req, res) => {
    const staffSkill = await db.findAllStaffSkill();
    if (staffSkill) {
      res.status(200).json(staffSkill);
    } else {
      res.send({ message: 'error' });
    }
  },

  findByUserId: async (req, res) => {
    const { user_id } = req.params;
    const staffSkill = await db.findByUserId(user_id);
    if (staffSkill) {
      res.status(200).send(staffSkill.map((item) => ({
        skill_name: item.skill_name,
      })));
    }
  },

  editStaffSkill: async (req, res) => {
    const { staff_skill } = req.params;
    const entity = { ...req.body };
    const staffSkill = await db.editStaffSkill(staff_skill, entity);
    if (staffSkill) {
      res.status(200).send({
        message: 'edit ok',
        user_id: staffSkill.user_id,
        skill_id: staffSkill.skill_id,
        level_id: staffSkill.level_id,
      });
    } else {
      res.send({
        message: 'edit false',
      });
    }
  },

  deleteStaffSkill: async (req, res) => {
    const { staff_skill, user_id } = req.params;
    const staffSkill = await db.deleteStaffSkill(staff_skill, user_id);
    if (staffSkill) {
      res.status(200).send({
        message: 'deleted successfully',
      });
    } else {
      res.send({
        message: 'Could not find user or skill to delete',
      });
    }
  },
};
