const pool = require('./db');

function model() { }

model.prototype = {
  createLevel: async (entity) => {
    try {
      const level = await pool.query('insert into Skill_level (level_name) values ($1) returning *', [entity.level_name]);
      return level.rows[0];
    } catch {
      return false;
    }
  },
};
module.exports = model;
