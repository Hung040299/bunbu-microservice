const express = require('express');

const app = express();
const Model = require('../model/project_staff');

const db = new Model();
app.use(express.json());
module.exports = {
  createProjectStaff: async (req, res) => {
    const entity = { ...req.body };
    const project = await db.createProjectStaff(entity);
    if (project) {
      res.status(200).send({
        message: 'create successfully',
        user_id: project.user_id,
        project_id: project.project_id,
      });
    } else {
      res.send({
        message: 'create false',
      });
    }
  },

  getProjectStaff: async (req, res) => {
    const { project_id } = req.params;
    const project = await db.findProjectStaff(project_id);
    if (project) {
      res.status(200).json(project);
    } else {
      res.send({ message: 'false' });
    }
  },

  deleteProjectStaff: async (req, res) => {
    const { project_id, user_id } = req.params;
    const project = await db.deleteProjectStaff(project_id, user_id);
    if (project) {
      res.status(200).send({
        message: 'deleted successfully',
      });
    } else {
      res.send({
        message: 'Could not find user or project to delete',
      });
    }
  },
};
