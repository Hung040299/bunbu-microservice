const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const app = require('../appTest');
const Func_test = require('../lib/user');

const model = new Func_test();
const Skill = require('../lib/skill');

chai.should();
const skill_test = new Skill();
const Staff_skillData = require('../lib/staff_skill');

const staffSkill_test = new Staff_skillData();
chai.use(chaiHttp);
process.env.NODE_ENV = 'test';
let access_token;
const account = {
  user_code: 'B09285',
  user_password: '123456',
  user_email: 'toan@gmail.com',
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

const account_test = {
  user_code: 'B09235',
  user_password: '123459',
  user_email: 'user@gmail.com',
  joining_date: '02-02-2020',
  official_date: '02-02-2020',
  contact_type: 'phone',
  position: 'staff',
  id_card: '1',
  roles_id: '2',
  avatar: 'null',
  profile_name: 'user',
  profile_phone: '0239487567',
  profile_address: 'abc',
  sex: 'nam',
  date_of_birth: '02-02-2020',
};
const skill_data_test = {
  skill_name: 'tieng anh',
};
const level_data_test = {
  level_name: 2,
};

describe('staff skill', () => {
  describe('/POST create staff skill', () => {
    beforeEach(async () => {
      const user = {
        user_code: 'B09935',
        user_password: '123856',
        user_email: 'afbhdg@gmail.com',
        joining_date: '02-02-2020',
        official_date: '02-02-2020',
        contact_type: 'phone',
        position: 'staff',
        id_card: '1',
        roles_id: '1',
        avatar: 'null',
        profile_name: 'user',
        profile_phone: '0239487567',
        profile_address: 'abc',
        sex: 'nam',
        date_of_birth: '02-02-2020',
      };
      await model.resetTable();
      await model.testCreateAccount(user);
      access_token = jwt.sign({ id: user.user_email }, process.env.SECRET);
    });
    it('create staff skill successfully', async () => {
      const account_skill = await model.testCreateAccount(account);
      console.log(account_skill)
      const Skill = await skill_test.testCreateSkill(skill_data);
      console.log(Skill)
      const level = await staffSkill_test.testSkillLevel(level_data);
      console.log(level)
      const Data = {
        user_id: account_skill.account.user_id,
        skill_id: Skill.skill_id,
        level_id: level.level_id,
      };
      console.log(Data)
      chai.request(app)
        .post('/api/staff_skill/create')
        .set('access_token', `${access_token}`)
        .send(Data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('create successfully');
          res.body.should.have.property('user_id').eql(account_skill.account.user_id);
          res.body.should.have.property('skill_id').eql(Skill.skill_id);
          res.body.should.have.property('level_id').eql(level.level_id);
        });
    });
  });

  describe('/EDIT staff skill', () => {
    beforeEach(async () => {
      const user = {
        user_code: 'B09935',
        user_password: '123856',
        user_email: 'afbhdg@gmail.com',
        joining_date: '02-02-2020',
        official_date: '02-02-2020',
        contact_type: 'phone',
        position: 'staff',
        id_card: '1',
        roles_id: '1',
        avatar: 'null',
        profile_name: 'user',
        profile_phone: '0239487567',
        profile_address: 'abc',
        sex: 'nam',
        date_of_birth: '02-02-2020',
      };
      await model.resetTable();
      await model.testCreateAccount(user);
      access_token = jwt.sign({ id: user.user_email }, process.env.SECRET);
    });
    it('edit staff skill successfully', async () => {
      const account_skill = await model.testCreateAccount(account);
      const Skill = await skill_test.testCreateSkill(skill_data);
      const level = await staffSkill_test.testSkillLevel(level_data);

      const account_skill_edit = await model.testCreateAccount(account_test);
      const Skill_edit = await skill_test.testCreateSkill(skill_data_test);
      const level_edit = await staffSkill_test.testSkillLevel(level_data_test);

      const Data = {
        user_id: account_skill.account.user_id,
        skill_id: Skill.skill_id,
        level_id: level.level_id,
      };
      const staff_skill = await staffSkill_test.testCreateStaffSkill(Data).staff_skill;
      const edit_data = {
        user_id: account_skill_edit.account,
        skill_id: Skill_edit.skill_id,
        level_id: level_edit.level_id,
      };

      chai.request(app)
        .put(`/api/staff_skill/edit/:${staff_skill}`)
        .set('access_token', access_token)
        .send(edit_data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('edit ok');
          res.body.should.have.property('user_id').eql('1200');
          res.body.should.have.property('skill_id').eql('1000');
          res.body.should.have.property('level_id').eql('3');
        });
    });
    it('edit fales', async () => {
      const account_skill = await model.testCreateAccount(account);
      const account_id = await account_skill.account.user_id;
      const Skill = await skill_test.testCreateSkill(skill_data);
      const skill_id = await Skill.skill_id;
      const level = await staffSkill_test.testSkillLevel(level_data);
      const level_id = await level.level_id;
      const Data = {
        user_id: account_id,
        skill_id,
        level_id,
      };
      const edit_data = {
        user_id: 1200,
        skill_id: 1000,
        level_id: 3,
      };
      const staff_skill = 100000000000000;
      await staffSkill_test.testCreateStaffSkill(Data).staff_skill;
      chai.request(app)
        .put(`/api/staff_skill/edit/:${staff_skill}`)
        .set('access_token', access_token)
        .send(Data, edit_data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('edit false');
        });
    });
  });

  describe('/DELETE staff skill', () => {
    beforeEach(async () => {
      const user = {
        user_code: 'B09935',
        user_password: '123856',
        user_email: 'afbhdg@gmail.com',
        joining_date: '02-02-2020',
        official_date: '02-02-2020',
        contact_type: 'phone',
        position: 'staff',
        id_card: '1',
        roles_id: '1',
        avatar: 'null',
        profile_name: 'user',
        profile_phone: '0239487567',
        profile_address: 'abc',
        sex: 'nam',
        date_of_birth: '02-02-2020',
      };
      await model.resetTable();
      await model.testCreateAccount(user);
      access_token = jwt.sign({ id: user.user_email }, process.env.SECRET);
    });
    it('deleted successfully', async () => {
      const account_skill = await model.testCreateAccount(account);
      const account_id = await account_skill.account.user_id;
      const Skill = await skill_test.testCreateSkill(skill_data);
      const skill_id = await Skill.skill_id;
      const level = await staffSkill_test.testSkillLevel(level_data);
      const level_id = await level.level_id;
      const Data = {
        user_id: account_id,
        skill_id,
        level_id,
      };
      const { staff_skill, user_id } = staffSkill_test.testCreateStaffSkill(Data);
      staffSkill_test.testDeleteStaffSkill(staff_skill, user_id);
      chai.request(app)
        .delete(`/api/staff_skill/:${staff_skill}/user/:${user_id}`)
        .set('access_token', access_token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('deleted successfully');
        });
    });
    it('Could not find user or project to delete', () => {
      const staff_skill = 10000000;
      const user_id = 1090000;
      staffSkill_test.testDeleteStaffSkill(staff_skill, user_id);
      chai.request(app)
        .delete(`/api/staff_skill/:${staff_skill}/user/:${user_id}`)
        .set('access_token', access_token)
        .end((err, res) => {
          res.body.should.have.property('message').eql('Could not find user or skill to delete');
        });
    });
  });
});
