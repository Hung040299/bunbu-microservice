const pool = require('./db');

function model() { }
model.prototype = {
  createAccount: async (entity) => {
    try {
      const account = await pool.query('insert into UserBunbu (user_code, user_password, user_email, joining_date, official_date, contact_type, position, id_card, role_id ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *', [entity.user_code, entity.user_password, entity.user_email, entity.joing_date, entity.official_date, entity.contact_type, entity.position, entity.id_card, entity.role_id]);
      const { user_id } = account.rows[0];
      const userProfile = await pool.query('insert into Profile (avatar, profile_name, profile_phone, profile_address, sex, date_of_birth, user_id) values ($1, $2, $3, $4, $5, $6, $7) returning *', [entity.avatar, entity.profile_name, entity.profile_phone, entity.profile_address, entity.sex, entity.date_of_birth, user_id]);
      return { account: account.rows[0], userProfile: userProfile.rows[0] };
    } catch (error) {
      return error;
    }
  },

  getlistAccount: async (role_id) => {
    const acc = 'select * from UserBunbu where role_id not in (select role_id from Roles where role_id=$1)';
    const result = await pool.query(acc, [role_id]);
    return result.rows;
  },

  findByEmail: async (user_email) => {
    const user = 'select * from UserBunbu where user_email = $1 ';
    const result = await pool.query(user, [user_email]);
    if (result) return result.rows[0];
    return false;
  },

  findById: async (user_id) => {
    const user = 'select * from UserBunbu join Profile on UserBunbu.user_id = Profile.user_id where UserBunbu.user_id = $1';
    const result = await pool.query(user, [user_id]);
    if (result) return result.rows[0];
    return false;
  },

  editPassword: async (user_password, user_email) => {
    try {
      const password = await pool.query('update UserBunbu set user_password=$1 where user_email=$2 returning *', [user_password, user_email]);
      return password.rows[0].user_password;
    } catch (error) {
      return error;
    }
  },

  editAccount: async (user_id, entity) => {
    try {
      if (entity.user_password == null && entity.user_email == null) {
        const account = 'update UserBunbu set user_code = $1, joining_date = $2, official_date = $3, contact_type = $4, position = $5, id_card = $6, role_id = $7 where user_id = $8 returning *';
        const result = await pool.query(account, [entity.user_code, entity.joing_date, entity.official_date, entity.contact_type, entity.position, entity.id_card, entity.role_id, user_id]);
        return result.rows[0];
      }
      return false;
    } catch (error) {
      return error;
    }
  },
  deleteAccount: async (user_id) => {
    const account = await pool.query('delete from UserBunbu where user_id =$1', [user_id]);
    if (account.rowCount) return true;
    return false;
  },
};

module.exports = model;
