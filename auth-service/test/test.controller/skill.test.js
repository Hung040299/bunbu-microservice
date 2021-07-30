const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const app = require('../appTest');
const Func_test = require('../lib/user');

chai.should();
const model = new Func_test();
const SkilltModel = require('../../model/skill');

const findSkill = new SkilltModel();
const Skill = require('../lib/skill');

const skill_test = new Skill();
chai.use(chaiHttp);
process.env.NODE_ENV = 'test';
let access_token;
const entity = {
  skill_name: 'JS',
};
describe('skill', () => {
  describe('/POST create skill', () => {
    beforeEach((done) => {
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
      model.resetTable();
      model.testCreateAccount(user);
      access_token = jwt.sign({ id: user.user_email }, process.env.SECRET);
      done();
    });
    it('create skill successfully', () => {
      const entity = {
        skill_name: 'JS',
      };
      chai.request(app)
        .post('/api/skill/create_skill')
        .set('access_token', `${access_token}`)
        .send(entity)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('create successfully');
          res.body.should.have.property('skill_name').eql('JS');
        });
    });
  });

  describe('/GET/:skill_id', () => {
    beforeEach((done) => {
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
      model.resetTable();
      model.testCreateAccount(user);
      access_token = jwt.sign({ id: user.user_email }, process.env.SECRET);
      done();
    });
    it('find skill successfully', async () => {
      const skill_id = await skill_test.testCreateSkill(entity).skill_id;
      await findSkill.findSkillById(skill_id);
      chai.request(app)
        .post('/api/skill/create_skill')
        .set('access_token', `${access_token}`)
        .send(skill_id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('skill_name').eql('JS');
        });
    });
    it('find skill error', async () => {
      const skill_id = '100000000';
      await skill_test.testCreateSkill(entity).skill_id;
      await findSkill.findSkillById(skill_id);
      chai.request(app)
        .post('/api/skill/create_skill')
        .set('access_token', `${access_token}`)
        .send(skill_id)
        .end((err, res) => {
          res.body.should.have.property('message').eql('error');
        });
    });
  });

  describe('/PUT/:skill_id edit skill', () => {
    beforeEach((done) => {
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
      model.resetTable();
      model.testCreateAccount(user);
      access_token = jwt.sign({ id: user.user_email }, process.env.SECRET);
      done();
    });
    it('edit skill successfully', async () => {
      const skillData = {
        skill_name: 'JS',
      };
      const edit_skill = {
        skill_name: 'golang',
      };
      const skill_id = await skill_test.testCreateSkill(entity).skill_id;
      chai.request(app)
        .put(`/api/skill/edit_skill/:${skill_id}`)
        .set('access_token', `${access_token}`)
        .send(skillData, edit_skill)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('ok');
          res.body.should.have.property('skill_name').eql('golang');
        });
    });

    it('edit false', async () => {
      const skillData = {
        skill_name: 'JS',
      };
      const edit_skill = {
        skill_name: 'golang',
      };
      const skill_id = 10000000000;
      await skill_test.testCreateSkill(entity).skill_id;
      chai.request(app)
        .put(`/api/skill/edit_skill/:${skill_id}`)
        .set('access_token', `${access_token}`)
        .send(skillData, edit_skill)
        .end((err, res) => {
          res.body.should.have.property('message').eql('edit false');
        });
    });
  });

  describe('/DELETE/:skill_id delete skill', () => {
    beforeEach((done) => {
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
      model.resetTable();
      model.testCreateAccount(user);
      access_token = jwt.sign({ id: user.user_email }, process.env.SECRET);
      done();
    });

    it('deleted successfully', async () => {
      const entity = {
        skill_name: 'JS',
      };
      const { skill_id } = skill_test.testCreateSkill(entity);
      skill_test.testDeleteSkill(skill_id);
      chai.request(app)
        .delete(`/api/account/delete_account/:${skill_id}`)
        .set('access_token', access_token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('deleted successfully');
        });
    });
    it('error', () => {
      const skill_id = 10000000000;
      skill_test.testCreateSkill(skill_id);
      chai.request(app)
        .delete(`/api/account/delete_account/:${skill_id}`)
        .set('access_token', access_token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('Could not find a skill to delete');
        });
    });
  });
});
