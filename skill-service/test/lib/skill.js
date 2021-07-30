const pool = require('../../model/db');

function model() { }
model.prototype = {
  resetTable: async () => {
    const query = 'Truncate Skill CASCADE';
    await pool.query(query);
  },

  testCreateSkill: async (entity) => {
    try {
      const skill = await pool.query('insert into Skill (skill_name) values ($1) returning *', [entity.skill_name]);
      return skill.rows[0];
    } catch {
      return false;
    }
  },

  testDeleteSkill: async (skill_id) => {
    const skill = await pool.query('delete from Skill where skill_id = $1', [skill_id]);
    if (skill.rowCount) return true;
    return false;
  },
};
module.exports = model;
