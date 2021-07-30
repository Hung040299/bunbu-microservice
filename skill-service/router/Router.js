const express = require('express');

const router = express.Router();
const { requireAdmin } = require('../verify/verify');
const { verify } = require('../verify/verify');
const { requireAdminOrHr } = require('../verify/verify');

router.use('/',verify);

const project = require('../controller/projectController');

router.post('/api/project/create_project',requireAdmin, project.createProject);
router.put('/api/project/edit_project/:project_id', requireAdmin, project.editProject);
router.get('/api/project/all_project', requireAdmin, project.getAllProject);
router.get('/api/project/find_project/:project_id', requireAdmin, project.getProjectById);
router.delete('/api/project/delete_project/:project_id', requireAdmin, project.deleteProject);

const csv = require('../export/csv');

router.get('/api/csv/export_csv', requireAdmin, csv.downloadProjectCsv);
router.get('/api/csv/skill_user', requireAdminOrHr, csv.downloadCsvSkillAllUser);
router.get('/api/csv/project_skill', requireAdminOrHr, csv.downloadCsvProjectAllUser);
router.get('/api/csv/user', requireAdminOrHr, csv.downloadCsvAllUser);

const staff = require('../controller/project_staffController');

router.post('/api/project_staff/create', requireAdmin, staff.createProjectStaff);
router.get('/api/project/:project_id/users', requireAdmin, staff.getProjectStaff);
router.delete('/api/project/:project_id/user/:user_id', requireAdmin, staff.deleteProjectStaff);

const skill = require('../controller/skillController');

router.post('/api/skill/create_skill', requireAdmin, skill.createSkill);
router.get('/api/skill/find_skill', requireAdmin, skill.findAllSkill);
router.get('/api/skill/find_skill/:skill_id', requireAdmin, skill.findSkillById);
router.put('/api/skill/edit_skill/:skill_id', requireAdmin, skill.editSkill);
router.delete('/api/skill/delete_skill/:skill_id', requireAdmin, skill.deleteSkill);

const level = require('../controller/skill_levelController');

router.post('/api/level/create_level', requireAdmin, level.createLevel);

const staffSkill = require('../controller/staff_skillController');

router.post('/api/staff_skill/create', requireAdmin, staffSkill.createStaffSkill);
router.get('/api/staff_skill/find_all', requireAdmin, staffSkill.findAllStaffSkill);
router.get('/api/staff_skill/find/:user_id', requireAdmin, staffSkill.findByUserId);
router.put('/api/staff_skill/edit/:staff_skill', requireAdmin, staffSkill.editStaffSkill);
router.delete('/api/staff_skill/:staff_skill/user/:user_id', requireAdmin, staffSkill.deleteStaffSkill);
module.exports = router;
