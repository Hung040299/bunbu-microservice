const con = require('../config/postgreSql/postgreSQL')
const profile = require('../models/profile.model')
function model() { }
model.prototype = {
  addCV: async (account_id, entity) => {
    let now = new Date()
    try {
      await con.query('BEGIN')
      const queryCV = 'INSERT INTO cv_templates(location, skill, product, link_img, user_role_id, created_at, update_at) VALUES ($1, $2, $3, $4, $5, $6, $7) returning *'
      const cv = await con.query(queryCV, [entity.location, entity.skill, entity.product, entity.link_img, account_id, now, now])

      const queryEXP = 'INSERT INTO experiences_templates(old_company, join_date, out_date, cv_template_id, created_at, update_at) VALUES ($1, $2, $3, $4, $5, $6) returning *'
      const exp = await con.query(queryEXP, [entity.old_company, entity.join_date, entity.out_date, cv.rows[0].cv_template_id, now, now])

      const queryPL = 'INSERT INTO programming_languages_used_templates(programming_language_template_name, experience_template_id, created_at, update_at)VALUES ($1, $2, $3, $4) returning *'
      const pro_language = await con.query(queryPL, [entity.programming_language_template_name, exp.rows[0].experience_template_id, now, now])
      await con.query('COMMIT')
      return { cv: cv.rows[0], exp: exp.rows[0], pro_language: pro_language.rows[0] }
    }
    catch {
      await con.query('ROLLBACK')
      return null
    }
  },

  editCV: async (id, entity) => {
    let now = new Date()
    try {
      await con.query('BEGIN')
      const queryCV = 'UPDATE cv_templates SET location=$1, skill=$2, product=$3, link_img=$4, update_at=$5 WHERE cv_template_id=$6 returning *'
      const cv = await con.query(queryCV, [entity.location, entity.skill, entity.product, entity.link_img, now, id])

      const queryEXP = 'UPDATE experiences_templates SET old_company=$1, join_date=$2, out_date=$3, update_at=$4 WHERE cv_template_id=$5 returning *'
      const exp = await con.query(queryEXP, [entity.old_company, entity.join_date, entity.out_date, now, cv.rows[0].cv_template_id])

      const queryPL = 'UPDATE programming_languages_used_templates SET programming_language_template_name=$1, update_at=$2 WHERE experience_template_id=$3 returning *'
      const pro_language = await con.query(queryPL, [entity.programming_language_template_name, now, exp.rows[0].experience_template_id])
      await con.query('COMMIT')
      return { cv: cv.rows[0], exp: exp.rows[0], pro_language: pro_language.rows[0] }
    }
    catch {
      await con.query('ROLLBACK')
      return false
    }
  },

  showCV: async (id) => {
    const query = `select cv_templates.cv_template_id, cv_templates.user_role_id, cv_templates.location, cv_templates.skill, cv_templates.product, cv_templates.link_img, experiences_templates.old_company, experiences_templates.join_date,
                          experiences_templates.out_date, programming_languages_used_templates.programming_language_template_name
                   from cv_templates join experiences_templates on cv_templates.cv_template_id = experiences_templates.cv_template_id
                           join programming_languages_used_templates on programming_languages_used_templates.experience_template_id = experiences_templates.experience_template_id where cv_templates.cv_template_id = ${id}`
    const result = await con.query(query)
    return result.rows[0]
  },

  deleteCV: async (id) => {
    try {
      const query = `delete from cv_templates where cv_templates.cv_template_id = ${id}`
      const result = await con.query(query)
      return result
    }
    catch {
      return false
    }

  },

  showAllCV: async () => {
    const query = `select cv_templates.cv_template_id, cv_templates.user_role_id, cv_templates.location, cv_templates.skill, cv_templates.product, cv_templates.link_img, experiences_templates.old_company, experiences_templates.join_date,
                     experiences_templates.out_date, programming_languages_used_templates.programming_language_template_name
                   from cv_templates join experiences_templates on cv_templates.cv_template_id = experiences_templates.cv_template_id
                    join programming_languages_used_templates on programming_languages_used_templates.experience_template_id = experiences_templates.experience_template_id order by cv_templates.created_at`
    const result = await con.query(query)
    return result.rows
  },
}

module.exports = model
