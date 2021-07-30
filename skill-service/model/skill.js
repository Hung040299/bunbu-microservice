const pool = require('./db');

function model() { }
model.prototype = {
  createSkill: async (entity) => {
    try {
      const skill = await pool.query('insert into Skill (skill_name) values ($1) returning *', [entity.skill_name]);
      return skill.rows[0];
    } catch {
      return false;
    }
  },

  findAllSkill: async () => {
    const skill = await pool.query('select * from Skill');
    return skill.rows;
  },

  findSkillById: async (skill_id) => {
    const skill = await pool.query('select * from Skill where skill_id = $1', [skill_id]);
    return skill.rows[0];
  },

  editSkill: async (skill_id, entity) => {
    try {
      const skill = await pool.query('update Skill set skill_name = $1 where skill_id = $2 returning *', [entity.skill_name, skill_id]);
      return skill.rows[0];
    } catch {
      return false;
    }
  },

  deleteSkill: async (skill_id) => {
    const skill = await pool.query('delete from Skill where skill_id = $1', [skill_id]);
    if (skill.rowCount) return true;
    return false;
  },
};
module.exports = model;
