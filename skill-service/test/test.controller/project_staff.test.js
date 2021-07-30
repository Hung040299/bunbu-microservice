const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const app = require('../appTest');
const Func_test = require('../lib/user');

chai.should();
const model = new Func_test();
const Project = require('../lib/project');

const project_test = new Project();
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
const entity = {
  project_name: 'abcd',
  create_date: '02-02-2020',
  description: 'ab',
  deadline: '04-02-2020',
};

describe('project staff', () => {
  describe('/POST create project staff', async () => {
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
    it('create project staff succsesfully', async () => {
      const account_project = await model.testCreateAccount(account);
      const Project = await project_test.testCreateProject(entity);
      const projectStaff = {
        user_id: account_project.account.user_id,
        project_id: Project.project_id,
        join_date: '02-02-2020',
        exit_date: '04-02-2020',
      };
      chai.request(app)
        .post('/api/project_staff/create')
        .set('access_token', `${access_token}`)
        .send(projectStaff)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('create successfully');
          res.body.should.have.property('user_id').eql(account_project.account.user_id);
          res.body.should.have.property('project_id').eql(Project.project_id);
        });
    });
  });

  describe('/DELETE project staff', () => {
    beforeEach(async () => {
      const user = {
        user_code: 'B9235',
        user_password: '123456',
        user_email: 'adg@gmail.com',
        joining_date: '02-02-2020',
        official_date: '02-02-2020',
        contact_type: 'phone',
        position: 'staff',
        id_card: '1',
        roles_id: '1',
      };
      model.resetTable();
      model.testCreateAccount(user);
      access_token = jwt.sign({ id: user.user_email }, process.env.SECRET);
    });
    it('deleted successfully', async () => {
      const account_project = await model.testCreateAccount(account);
      const account_id = await account_project.account.user_id;
      const Project = await project_test.testCreateProject(entity);
      const projectStaff_id = await Project.project_id;
      const projectStaff = {
        user_id: account_id,
        project_id: projectStaff_id,
        join_date: '02-02-2020',
        exit_date: '04-02-2020',
      };
      const { project_id, user_id } = project_test.testCreateProjectStaff(projectStaff);
      project_test.testDeleteProjectStaff(project_id, user_id);
      chai.request(app)
        .delete(`/api/project/:${project_id}/user/:${user_id}`)
        .set('access_token', access_token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('deleted successfully');
        });
    });
    it('Could not find user or project to delete', () => {
      const user_id = 1090000;
      const project_id = 10000000;
      project_test.testDeleteProjectStaff(project_id, user_id);
      chai.request(app)
        .delete(`/api/project/:${project_id}/user/:${user_id}`)
        .set('access_token', access_token)
        .end((err, res) => {
          res.body.should.have.property('message').eql('Could not find user or project to delete');
        });
    });
  });
});
