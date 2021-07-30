const con = require('../config/postgreSql/postgreSQL')

function model() { }
model.prototype = {
  addCV: async (account_id, entity) => {
    let now = new Date()
    try {
      await con.query('BEGIN')
      const queryCV = 'INSERT INTO cvs(location, skill, product, link_img, user_role_id, created_at, update_at) VALUES ($1, $2, $3, $4, $5, $6, $7) returning *'
      const cv = await con.query(queryCV, [entity.location, entity.skill, entity.product, entity.link_img, await getUserRoleID(account_id), now, now])

      const queryEXP = 'INSERT INTO experiences(old_company, join_date, out_date, cv_id, created_at, update_at) VALUES ($1, $2, $3, $4, $5, $6) returning *'
      const exp = await con.query(queryEXP, [entity.old_company, entity.join_date, entity.out_date, cv.rows[0].cv_id, now, now])

      const queryPL = 'INSERT INTO programming_languages_used(programming_language_name, experience_id, created_at, update_at)VALUES ($1, $2, $3, $4) returning *'
      const pro_language = await con.query(queryPL, [entity.programming_language_name, exp.rows[0].experience_id, now, now])
      await con.query('COMMIT')
      return { cv: cv.rows[0], exp: exp.rows[0], pro_language: pro_language.rows[0] }
    }
    catch {
      await con.query('ROLLBACK')
      return null
    }
  },

  viewByTagName: async (tag_name) => {
    const query = `select accounts.* from tag_name join cvs on tag_name.cv_id = cvs.cv_id
                    join user_roles on cvs.user_role_id = user_roles.user_role_id
                    join accounts on user_roles.account_id = accounts.account_id
                    where tag_name.tag_name ilike '%${tag_name}%'`
    const result = await con.query(query)
    return result.rows
  }
}

const getUserRoleID = async (account_id) => {
  const query = `select * from user_roles where account_id = ${account_id}`
  const result = await con.query(query)
  return result.rows[0].user_role_id
}

module.exports = { model, getUserRoleID }
