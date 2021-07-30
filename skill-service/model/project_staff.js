const pool = require('./db');

function model() { }
model.prototype = {
  createProjectStaff: async (entity) => {
    try {
      const project = await pool.query('insert into Project_staff (user_id, project_id, join_date, exit_date) values ($1, $2, $3, $4) returning *', [entity.user_id, entity.project_id, entity.join_date, entity.exit_date]);
      return project.rows[0];
    } catch (error) {
      return false;
    }
  },

  findProjectStaff: async (project_id) => {
    const projectStaff = await pool.query('select ps.project_staff, u.user_id, pj.project_name, ps.join_date, ps.exit_date from Project_staff ps join UserBunbu u on ps.user_id = u.user_id join Project pj on ps.project_id = pj.project_id where ps.project_id = $1', [project_id]);
    if (projectStaff) return projectStaff.rows;
    return false;
  },

  deleteProjectStaff: async (project_id, user_id) => {
    const projectStaff = await pool.query('delete from Project_staff where project_id = $1 and user_id = $2 ', [project_id, user_id]);
    if (projectStaff.rowCount) return true;
    return false;
  },
};
module.exports = model;
