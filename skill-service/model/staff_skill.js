const pool = require('./db');

function model() { }
model.prototype = {
  createStaffSkill: async (entity) => {
    try {
      const staffSkill = await pool.query('insert into Staff_skill (user_id, skill_id, level_id) values ($1, $2, $3) returning *', [entity.user_id, entity.skill_id, entity.level_id]);
      return staffSkill.rows[0];
    } catch {
      return false;
    }
  },

  findAllStaffSkill: async () => {
    const staffSkill = await pool.query('select * from UserBunbu ub join Staff_skill ss on ub.user_id = ss.user_id');
    return staffSkill.rows;
  },

  findByUserId: async (user_id) => {
    const staffSkill = await pool.query('select * from Staff_skill ss join Skill s on s.skill_id = ss.skill_id where ss.user_id = $1', [user_id]);
    if (staffSkill) return staffSkill.rows;
    return false;
  },

  editStaffSkill: async (staff_skill, entity) => {
    try {
      const staffSkill = 'update Staff_skill set user_id = $1, skill_id = $2, level_id = $3 where staff_skill = $4 returning *';
      const result = await pool.query(staffSkill, [entity.user_id, entity.skill_id, entity.level_id, staff_skill]);
      return result.rows[0];
    } catch {
      return false;
    }
  },

  deleteStaffSkill: async (staff_skill, user_id) => {
    const staffSkill = await pool.query('delete from Staff_skill where staff_skill = $1 and user_id = $2', [staff_skill, user_id]);
    if (staffSkill.rowCount) return true;
    return false;
  },
};
module.exports = model;
