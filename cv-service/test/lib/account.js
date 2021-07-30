const bcrypt = require('bcryptjs')
const con = require('../../config/postgreSql/postgreSQL')
function model() { }

model.prototype = {
  createAccount: async (entity) => {
    let now = new Date()
    let hash = bcrypt.hashSync(entity.password, 8);
    entity.password = hash
    let queryTextUC = `insert into accounts( user_name, password, phone_numbers, email, link_img, create_at, update_at) values( $1, $2, $3, $4, $5, $6, $7) RETURNING account_id `
    const account = await con.query(queryTextUC, [entity.user_name, entity.password, entity.phone_numbers, entity.email, entity.link_img, now, now])
    return account.rows[0].account_id
  },
  resetTable: async () => {
    const query = `Truncate accounts CASCADE`
    await con.query(query)
  }
}

module.exports = model
