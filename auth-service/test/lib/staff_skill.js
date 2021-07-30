const pool = require('../../model/db');

function model() { }
model.prototype = {
  resetTable: async () => {
    const query = 'Truncate Staff_skill CASCADE';
    await pool.query(query);
  },

  resetAccount: async () => {
    const query = 'Truncate userbunbu CASCADE';
    await pool.query(query);
  },

  testCreateStaffSkill: async (entity) => {
    try {
      const staffSkill = await pool.query('insert into Staff_skill (user_id, skill_id, level_id) values ($1, $2, $3) returning *', [entity.user_id, entity.skill_id, entity.level_id]);
      return staffSkill.rows[0];
    } catch {
      return false;
    }
  },

  testSkillLevel: async (entity) => {
    try {
      const level = await pool.query('insert into Skill_level (level_name) values ($1) returning *', [entity.level_name]);
      return level.rows[0];
    } catch {
      return false;
    }
  },

  testEditStaffSkill: async (staff_skill, entity) => {
    try {
      const staffSkill = 'update Staff_skill set user_id = $1, skill_id = $2, level_id = $3 where staff_skill = $4 returning *';
      const result = await pool.query(staffSkill, [entity.user_id, entity.skill_id, entity.level_id, staff_skill]);
      return result.rows[0];
    } catch {
      return false;
    }
  },

  testDeleteStaffSkill: async (staff_skill, user_id) => {
    const staffSkill = await pool.query('delete from Staff_skill where staff_skill = $1 and user_id = $2', [staff_skill, user_id]);
    if (staffSkill.rowCount) return true;
    return false;
  },
};
module.exports = model;
