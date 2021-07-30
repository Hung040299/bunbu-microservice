require('dotenv').config();
const CsvParser = require('json2csv').Parser;
const Pool = require('../model/project');

const db = new Pool();
const model = require('../model/db');

module.exports = {
  downloadProjectCsv: async (req, res) => {
    const list = await db.findAllProject();
    const csvFiels = ['project_id', 'project_name', 'create_date', 'description', 'deadline'];
    const csvParser = new CsvParser({ csvFiels });
    const csvData = csvParser.parse(list);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename = project.csv');
    res.send(csvData);
  },

  downloadCsvSkillAllUser: async (req, res) => {
    const list = await model.query('select ub.user_id, ub.user_code, ub.user_email, s.skill_name from Staff_skill ss  join UserBunbu ub on ub.user_id = ss.user_id join Skill s on ss.skill_id = s.skill_id');
    const csvFiels = ['user_id', 'user_code', 'user_email', 'skill_name'];
    const csvParser = new CsvParser({ csvFiels });
    const csvData = csvParser.parse(list.rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename = skill_user.csv');
    res.send(csvData);
  },

  downloadCsvProjectAllUser: async (req, res) => {
    const list = await model.query('select ub.user_code, ub.user_email, pt.project_name, pt.deadline from Project_staff ps join Project pt on ps.project_id = pt.project_id join UserBunbu ub on ps.user_id = ub.user_id');
    const csvFiels = ['user_code', 'user_email', 'project_name', 'deadline'];
    const csvParser = new CsvParser({ csvFiels });
    const csvData = csvParser.parse(list.rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename = user_project.csv');
    res.send(csvData);
  },

  downloadCsvAllUser: async (req, res) => {
    const list = await model.query('select user_code, user_email, position, roles_id  from UserBunbu');
    const csvFiels = ['user_code', 'user_email', 'position', 'roles_id'];
    const csvParser = new CsvParser({ csvFiels });
    const csvData = csvParser.parse(list.rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename = user.csv');
    res.send(csvData);
  },
};
