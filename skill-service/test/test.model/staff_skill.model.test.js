const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');
const User = require('../lib/user');

const user_skill = new User();
chai.use(chaiHttp);
const Data_skill = require('../lib/skill');

const skill_test = new Data_skill();
const Data_staff_skill = require('../lib/staff_skill');

chai.should();
const func_test = new Data_staff_skill();
const StaffSKill = require('../../model/staff_skill');

const model = new StaffSKill();
process.env.NODE_ENV === 'test';

const account = {
  user_code: 'B09285',
  user_password: '123456',
  user_email: 'hung1204@gmail.com',
  joining_date: '02-02-2020',
  official_date: '02-02-2020',
  contact_type: 'phone',
  position: 'staff',
  id_card: '1',
  roles_id: '2',
  avatar: 'null',
  profile_name: 'hoang',
  profile_phone: '0239487567',
  profile_address: 'abc',
  sex: 'nam',
  date_of_birth: '02-02-2020',
};
const skill_data = {
  skill_name: 'giao tiep',
};
const level_data = {
  level_name: 1,
};

describe('model staff skill', () => {
  describe('create staff skill', () => {
    beforeEach(async () => {
      await func_test.resetTable();
      await func_test.resetAccount();
    });
    it('create staff skill successfully', async () => {
      const account_skill = await user_skill.testCreateAccount(account);
      const Skill = await skill_test.testCreateSkill(skill_data);
      const level_id = await func_test.testSkillLevel(level_data);
      const StaffSKill_data = {
        user_id: account_skill.user_id,
        skill_id: Skill.skill_id,
        level_id: level_id.level_id,
      };
      const staff_skill = await func_test.testCreateStaffSkill(StaffSKill_data);
      expect(staff_skill.skill_id).to.eql(Skill.skill_id);
    });
  });

  describe('edit staff skill', () => {
    beforeEach(async () => {
      await func_test.resetTable();
      await func_test.resetAccount();
    });
    it('edit staff skill', async () => {
      const account_skill = await user_skill.testCreateAccount(account);
      const account_id = await account_skill.userProfile.user_id;
      const Skill = await skill_test.testCreateSkill(skill_data);
      const skill_id = await Skill.skill_id;
      const { level_id } = await func_test.testSkillLevel(level_data);
      const StaffSKill_data = {
        user_id: account_id,
        skill_id,
        level_id,
      };
      const entity = {
        level_id: 3,
      };
      const staff = await func_test.testCreateStaffSkill(StaffSKill_data);
      const staff_skill_id = await staff.staff_skill;
      const result = await model.editStaffSkill(staff_skill_id, entity);
      expect(result.level_id).to.eql(3);
    });
  });
});
