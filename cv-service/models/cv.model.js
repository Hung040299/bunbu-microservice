const con = require('../config/postgreSql/postgreSQL')

function model() { }
model.prototype = {
  editCV: async (id, entity) => {
    let now = new Date()
    try {
      await con.query('BEGIN')
      const queryCV = 'UPDATE cvs SET location=$1, skill=$2, product=$3, link_img=$4, update_at=$5 WHERE cv_id=$6 returning *'
      const cv = await con.query(queryCV, [entity.location, entity.skill, entity.product, entity.link_img, now, id])

      const queryEXP = 'UPDATE experiences SET old_company=$1, join_date=$2, out_date=$3, update_at=$4 WHERE cv_id=$5 returning *'
      const exp = await con.query(queryEXP, [entity.old_company, entity.join_date, entity.out_date, now, cv.rows[0].cv_id])

      const queryPL = 'UPDATE programming_languages_used SET programming_language_name=$1, update_at=$2 WHERE experience_id=$3 returning *'
      const pro_language = await con.query(queryPL, [entity.programming_language_name, now, exp.rows[0].experience_id])
      await con.query('COMMIT')
      return { cv: cv.rows[0], exp: exp.rows[0], pro_language: pro_language.rows[0] }
    }
    catch {
      await con.query('ROLLBACK')
      return false
    }
  },

  showCV: async (id) => {
    const query = `select cvs.cv_id, cvs.user_role_id, cvs.location, cvs.skill, cvs.product, cvs.link_img, experiences.old_company, experiences.join_date,
                          experiences.out_date, programming_languages_used.programming_language_name
                   from cvs join experiences on cvs.cv_id = experiences.cv_id
                           join programming_languages_used on programming_languages_used.experience_id = experiences.experience_id where cvs.cv_id = ${id}`
    const result = await con.query(query)
    return result.rows[0]
  },

  deleteCV: async (id) => {
    try {
      const query = `delete from cvs where cvs.cv_id = ${id}`
      const result = await con.query(query)
      return result
    }
    catch {
      return false
    }

  },

  showAllCV: async () => {
    const query = `select cvs.cv_id, cvs.user_role_id, cvs.location, cvs.skill, cvs.product, cvs.link_img, experiences.old_company, experiences.join_date,
                     experiences.out_date, programming_languages_used.programming_language_name
                   from cvs join experiences on cvs.cv_id = experiences.cv_id
                    join programming_languages_used on programming_languages_used.experience_id = experiences.experience_id`
    const result = await con.query(query)
    return result.rows
  },

  getProfileByCV: async (cvid) => {
    const query = `select accounts.* from cvs join user_roles on cvs.user_role_id = user_roles.user_role_id
                                     join accounts on user_roles.account_id = accounts.account_id
                                     where cvs.cv_id = ${cvid}`
    const result = await con.query(query)
    return result.rows[0]
  },

  addLike: async (account_id, cvid) => {
    try {
      const now = new Date()
      const query = 'insert into likes(account_id, cv_id, created_at, update_at) values ($1, $2, $3, $4)'
      const result = await con.query(query, [account_id, cvid, now, now])
      return result
    }
    catch {
      return false
    }
  },

  addTagName: async (cvid, tagname) => {
    let now = new Date()
    try {
      const query = 'INSERT INTO tag_name(tag_name, cv_id, update_at, created_at) VALUES ($1, $2, $3, $4) returning *;'
      const result = await con.query(query, [tagname, cvid, now, now])
      return result
    }
    catch {
      return false
    }
  },

  updateViewCount: async (cvid) => {
    try {
      const query = `UPDATE cvs SET view_count = view_count+1 WHERE cv_id=${cvid}`
      const result = await con.query(query)
      return result
    }
    catch {
      return false
    }
  },

  mostView: async () => {
    const query = `select cvs.cv_id, cvs.user_role_id, cvs.location, cvs.skill, cvs.product, cvs.link_img, experiences.old_company, experiences.join_date,
                     experiences.out_date, programming_languages_used.programming_language_name
                   from cvs join experiences on cvs.cv_id = experiences.cv_id
                    join programming_languages_used on programming_languages_used.experience_id = experiences.experience_id order by view_count desc`
    const result = await con.query(query)
    return result.rows
  },

  searchByTagName: async (tagname) => {
    const query = `select cvs.cv_id, cvs.user_role_id, cvs.location, cvs.skill, cvs.product, cvs.link_img, experiences.old_company, experiences.join_date,
                  experiences.out_date, programming_languages_used.programming_language_name
                  from tag_name join cvs on tag_name.cv_id = cvs.cv_id
                  join experiences on cvs.cv_id = experiences.cv_id
                  join programming_languages_used on programming_languages_used.experience_id = experiences.experience_id
                  where tag_name.tag_name ilike '%${tagname}%'
                  order by cvs.created_at`
    const result = await con.query(query)
    return result.rows
  },

  serchByLocation: async (location) => {
    const query = `select cvs.cv_id, cvs.user_role_id, cvs.location, cvs.skill, cvs.product, cvs.link_img, experiences.old_company, experiences.join_date,
                  experiences.out_date, programming_languages_used.programming_language_name
                  from cvs join experiences on cvs.cv_id = experiences.cv_id
                  join programming_languages_used on programming_languages_used.experience_id = experiences.experience_id
                  where cvs.location ilike '%${location}%' 
                  order by cvs.created_at`
    const result = await con.query(query)
    return result.rows
  }
}

module.exports = model
