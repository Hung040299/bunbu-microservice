const pool = require('./db');

function model() { }
model.prototype = {
  createProject: async (entity) => {
    try {
      const project = await pool.query('insert into Project (project_name, create_date, description, deadline) values ($1, $2, $3, $4) returning *', [entity.project_name, entity.create_date, entity.description, entity.deadline]);
      return project.rows[0];
    } catch (error) {
      return false;
    }
  },

  editProject: async (project_id, entity) => {
    try {
      const project = 'update Project set project_name = $1, create_date = $2, description = $3, deadline = $4 where project_id = $5 returning * ';
      const result = await pool.query(project, [entity.project_name, entity.create_date, entity.description, entity.deadline, project_id]);
      return result.rows[0];
    } catch (error) {
      return false;
    }
  },

  findAllProject: async () => {
    try {
      const project = 'select * from Project';
      const result = await pool.query(project);
      return result.rows;
    } catch {
      return false;
    }
  },

  findProjectById: async (project_id) => {
    try {
      const project = 'select * from Project where project_id = $1';
      const result = await pool.query(project, [project_id]);
      return result.rows[0];
    } catch {
      return false;
    }
  },

  deleteProject: async (project_id) => {
    const project = await pool.query('delete from Project where project_id =$1', [project_id]);
    if (project.rowCount) return true;
    return false;
  },
};
module.exports = model;
