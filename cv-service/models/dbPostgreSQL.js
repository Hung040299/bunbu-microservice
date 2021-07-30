const con = require('../config/postgreSql/postgreSQL');
function model() { };
model.prototype = {

  register: async function (entity, callback) {
    let now = new Date()
    try {
      if (entity.email == null) {
        return callback(false)
      }
      else {
        await con.query('BEGIN')
        let queryTextUC = `insert into accounts( user_name, password, phone_numbers, email, link_img, create_at, update_at) values( $1, $2, $3, $4, $5, $6, $7) RETURNING account_id `
        let result = await con.query(queryTextUC, [entity.user_name, entity.password, entity.phone_numbers, entity.email, entity.link_img, now, now])
        let account_id = result.rows[0].account_id
        if (entity.role_id == null) {
          return callback(null)
        }
        else {
          try {
            let queryInsertRoleUser = `insert into user_roles( role_id, account_id, create_at, update_at) values( $1, $2, $3, $4)`
            await con.query(queryInsertRoleUser, [entity.role_id, account_id, now, now])
            await con.query('COMMIT')
            return callback(account_id)
          }
          catch {
            await con.query('ROLLBACK')
            return callback(null)
          }
        }
      }
    }
    catch {
      await con.query('ROLLBACK')
      return callback(false)
    }
  },
  checkExistByEmail: async function (entity, callback) {
    let queryText = `select account_id from accounts where email = $1 `;
    let result = (await con.query(queryText, [entity.email])).rowCount;
    if (result > 0) {
      return callback(null);
    } else return callback(true);
  }
};

module.exports = model;
