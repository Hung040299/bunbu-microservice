const pool = require('./db');

function model() { }

model.prototype = {
  createRole: async (entity) => {
    try {
      const role = await pool.query('insert into Roles (roles_name) values ($1) returning *', [entity.roles_name]);
      return role.rows[0];
    } catch (error) {
      return false;
    }
  },

  findByRole: async (roles_id) => {
    const role = ('select * from Roles where roles_id = $1');
    const result = await pool.query(role, [roles_id]);
    if (result) return result.rows[0];
    return false;
  },
};
module.exports = model;
