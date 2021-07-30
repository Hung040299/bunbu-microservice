const con = require('../config/postgreSql/postgreSQL');

function model() { };
model.prototype = {
  listAccount: async (callback) => {
    const query = 'select * from accounts'
    const list = await con.query(query)
    return callback(list)
  },
  getByID: async (id) => {
    const query = 'select * from accounts where account_id = $1'
    const account = await con.query(query, [id])
    return account.rows[0]
  },
  checkRoleAccount: async (id) => {
    const query = `select roles.role_name from accounts join user_roles on accounts.account_id = user_roles.account_id
                    join roles on user_roles.role_id = roles.role_id
                    where accounts.account_id = ${id}`
    const result = await con.query(query)
    return result
  },
  deleteAccount: async (id) => {
    try {
      const query = 'delete from accounts where account_id = $1'
      const result = await con.query(query, [id])
      return result
    }
    catch
    {
      return false
    }

  },
  updateAccount: async (id, entity) => {
    try {
      const now = new Date()
      const query = 'UPDATE accounts SET phone_numbers=$1, user_name=$2, link_img=$3, update_at=$4 WHERE account_id= $5 returning *'
      const result = await con.query(query, [entity.phone_numbers, entity.user_name, entity.link_img, now, id])
      if (entity.role_id == null) {
        return result
      }
      else {
        const queryRole = 'UPDATE user_roles SET role_id = $1 where account_id = $2'
        await con.query(queryRole, [entity.role_id, id])
        return result
      }
    }
    catch {
      return false
    }
  },
}

module.exports = model
