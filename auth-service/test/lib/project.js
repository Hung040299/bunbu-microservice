const pool = require('../../model/db');

function model() { }
model.prototype = {
  resetTable: async () => {
    const query = 'Truncate Project CASCADE';
    await pool.query(query);
  },

  testCreateProject: async (entity) => {
    try {
      const project = await pool.query('insert into Project (project_name, create_date, description, deadline) values ($1, $2, $3, $4) returning *', [entity.project_name, entity.create_date, entity.description, entity.deadline]);
      return project.rows[0];
    } catch (error) {
      return error;
    }
  },

  testDeleteProject: async (project_id) => {
    const project = await pool.query('delete from Project where project_id =$1', [project_id]);
    if (project.rowCount) return true;
    return false;
  },

  testCreateProjectStaff: async (entity) => {
    try {
      const project = await pool.query('insert into Project_staff (user_id, project_id, join_date, exit_date) values ($1, $2, $3, $4) returning *', [entity.user_id, entity.project_id, entity.join_date, entity.exit_date]);
      return project.rows[0];
    } catch (error) {
      return false;
    }
  },

  testDeleteProjectStaff: async (project_id, user_id) => {
    const projectStaff = await pool.query('delete from Project_staff where project_id = $1 and user_id = $2 ', [project_id, user_id]);
    if (projectStaff.rowCount) return true;
    return false;
  },
};
module.exports = model;
