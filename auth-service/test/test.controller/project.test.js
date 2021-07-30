const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const app = require('../appTest');
const Func_test = require('../lib/user');

const model = new Func_test();
const account = require('../mocks/project_mocks');
const ProjectModel = require('../../model/project');

chai.should();
const findProject = new ProjectModel();
const Project = require('../lib/project');

const project_test = new Project();
chai.use(chaiHttp);
process.env.NODE_ENV = 'test';
let access_token;

describe('project', () => {
  describe('/POST create project', () => {
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
      model.resetTable();
      model.testCreateAccount(user);
      access_token = jwt.sign({ id: user.user_email }, process.env.SECRET);
    });
    it('create project successfully', () => {
      const entity = {
        project_name: 'abcd',
        create_date: '02-02-2020',
        description: 'ab',
        deadline: '04-02-2020',
      };
      chai.request(app)
        .post('/api/project/create_project')
        .set('access_token', `${access_token}`)
        .send(entity)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('create successfully');
          res.body.should.have.property('project_name').eql('abcd');
        });
    });
  });

  describe('/PUT edit project', () => {
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
      model.resetTable();
      model.testCreateAccount(user);
      access_token = jwt.sign({ id: user.user_email }, process.env.SECRET);
    });
    it('edit project successfully', async () => {
      const projectData = {
        project_name: 'abcd',
        create_date: '02-02-2020',
        description: 'ab',
        deadline: '04-02-2020',
      };
      const edit_project = {
        project_name: 'ban hang',
        create_date: '03-05-2020',
        description: '123',
        deadline: '04-07-2020',
      };
      const project_id = await project_test.testCreateProject(projectData).project_id;
      chai.request(app)
        .put(`/api/project/edit_project/:${project_id}`)
        .set('access_token', access_token)
        .send(projectData, edit_project)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('edit ok');
          res.body.should.have.property('project_name').eql('ban hang');
          res.body.should.have.property('create_date').eql('03-05-2020');
          res.body.should.have.property('description').eql('123');
          res.body.should.have.property('deadline').eql('04-07-2020');
        });
    });
    it('edit false', async () => {
      const projectData = {
        project_name: 'abcd',
        create_date: '02-02-2020',
        description: 'ab',
        deadline: '04-02-2020',
      };
      const edit_project = {
        project_name: 'ban hang',
        create_date: '03-05-2020',
        description: '123',
        deadline: '04-07-2020',
      };
      const project_id = 100000;
      await project_test.testCreateProject(projectData).project_id;
      chai.request(app)
        .put(`/api/project/edit_project/:${project_id}`)
        .set('access_token', access_token)
        .send(projectData, edit_project)
        .end((err, res) => {
          res.body.should.have.property('message').eql('edit false');
        });
    });
  });

  describe('/GET/:project_id find project by id', () => {
    beforeEach(() => {
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
    });

    it('successfully', async () => {
      account.forEach((item) => {
        project_test.testCreateProject(item);
      });
      const entity = {
        project_name: 'abcd',
        create_date: '02-02-2020',
        description: 'ab',
        deadline: '04-02-2020',
      };
      const project_id = await project_test.testCreateProject(entity).project_id;
      const project = await findProject.findProjectById(project_id);
      chai.request(app)
        .get(`/api/project/find_project/:${project_id}`)
        .set('access_token', access_token)
        .send(project)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('ok');
          res.body.should.have.property('pproject_name').eql('abcd');
          res.body.should.have.property('description').eql('ab');
          res.body.should.have.property('deadline').eql('04-02-2020');
        });
    });
  });

  describe('/DELETE/:project_id delete project', () => {
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
      model.resetTable();
      model.testCreateAccount(user);
      access_token = jwt.sign({ id: user.user_email }, process.env.SECRET);
    });
    it('Could not find a project to delete', async () => {
      account.forEach((item) => {
        project_test.testCreateProject(item);
      });
      const project_id = 1090000;
      project_test.testDeleteProject(project_id);
      chai.request(app)
        .delete(`/api/project/delete_project/:${project_id}`)
        .set('access_token', access_token)
        .end((err, res) => {
          res.body.should.have.property('message').eql('Could not find a project to delete');
        });
    });
    it('deleted successfully', async () => {
      const entity = {
        project_name: 'abcd',
        create_date: '02-02-2020',
        description: 'ab',
        deadline: '04-02-2020',
      };
      const { project_id } = project_test.testCreateProject(entity);
      project_test.testDeleteProject(project_id);
      chai.request(app)
        .delete(`/api/account/delete_account/:${project_id}`)
        .set('access_token', access_token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('deleted successfully');
        });
    });
  });
});
