const express = require('express');

const app = express();
const Model = require('../model/project');
const channel = require('../rabbitmq/channelCreator')
let data
const db = new Model();
app.use(express.json());
module.exports = {
  createProject: async (req, res) => {

    const entity = { ...req.body };
    const project = await db.createProject(entity);
    if (project) {
      res.send({
        message: 'create successfully',
        project_name: project.project_name,
      });
    } else {
      res.send({
        message: 'create false',
      });
    }
  },
  
  editProject: async (req, res) => {
    const { project_id } = req.params;
    const entity = { ...req.body };
    const project = await db.editProject(project_id, entity);
    if (project) {
      res.status(200).send({
        message: 'edit ok',
        project_name: project.project_name,
        description: project.description,
        deadline: project.deadline,
      });
    } else {
      res.send({
        message: 'edit false',
      });
    }
  },

  getAllProject: async (req, res) => {
    const project = await db.findAllProject();
    if (project) {
      res.status(200).json(project);
    } else {
      res.send({ message: 'There is no project to display' });
    }
  },

  getProjectById: async (req, res) => {
    const { project_id } = req.params;
    const project = await db.findProjectById(project_id);
    if (project) {
      res.status(200).send({
        message: 'ok',
        pproject_name: project.project_name,
        description: project.description,
        deadline: project.deadline,
      });
    } else {
      res.send({
        message: 'project not found',
      });
    }
  },

  deleteProject: async (req, res) => {
    const { project_id } = req.params;
    const project = await db.deleteProject(project_id);
    if (project) {
      res.status(200).send({
        message: 'deleted successfully',
      });
    } else {
      res.send({
        message: 'Could not find a project to delete',
      });
    }
  },
};
