const pool = require('../../model/db');

function model() { }
model.prototype = {
  resetTable: async () => {
    const query = 'Truncate UserBunbu CASCADE';
    await pool.query(query);
  },

  testCreateAccount: async (entity) => {
    try {
      const account = await pool.query('insert into UserBunbu (user_code, user_password, user_email, joining_date, official_date, contact_type, position, id_card, roles_id ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *', [entity.user_code, entity.user_password, entity.user_email, entity.joing_date, entity.official_date, entity.contact_type, entity.position, entity.id_card, entity.roles_id]);
      const { user_id } = account.rows[0];
      const userProfile = await pool.query('insert into Profile (avatar, profile_name, profile_phone, profile_address, sex, date_of_birth, user_id) values ($1, $2, $3, $4, $5, $6, $7) returning *', [entity.avatar, entity.profile_name, entity.profile_phone, entity.profile_address, entity.sex, entity.date_of_birth, user_id]);
      return { account: account.rows[0], userProfile: userProfile.rows[0] };
    } catch (error) {
      return error;
    }
  },

  testfindById: async (user_id) => {
    const user = 'select * from UserBunbu join Profile on UserBunbu.user_id = Profile.user_id where UserBunbu.user_id = $1';
    const result = await pool.query(user, [user_id]);
    if (result) return result.rows[0];
    return false;
  },

  testEditPassword: async (user_password, user_email) => {
    const password = await pool.query('update UserBunbu set user_password=$1 where user_email=$2 returning *', [user_password, user_email]);
    return password.rows[0].user_password;
  },

  testEditAccount: async (user_id, entity) => {
    try {
      const account = 'update UserBunbu set user_code = $1, user_password = $2, joining_date = $3, official_date = $4,contact_type = $5, position = $6, id_card = $7 where user_id = $8 returning *';
      const result = await pool.query(account, [entity.user_code, entity.user_password, entity.joing_date, entity.official_date, entity.contact_type, entity.position, entity.id_card, user_id]);
      return result.rows[0];
    } catch (error) {
      return error;
    }
  },

  testDeleteAccount: async (user_id) => {
    const account = await pool.query('delete from UserBunbu where user_id =$1', [user_id]);
    if (account.rowCount) return true;
    return false;
  },
};

module.exports = model;
