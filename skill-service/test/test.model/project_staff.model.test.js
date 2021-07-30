const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');
const User = require('../lib/user');

const user_project = new User();
chai.use(chaiHttp);
const Data_project = require('../lib/project');

chai.should();
const func_test = new Data_project();
process.env.NODE_ENV === 'test';

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

describe('model project staff', () => {
  describe('create project staff', () => {
    beforeEach((done) => {
      func_test.resetTable();
      done();
    });
    it('create project staff successfully', async () => {
      const account_project = await user_project.testCreateAccount(account);
      const account_id = await account_project.user_id;
      const Project = await func_test.testCreateProject(entity);
      const project_id = await Project.project_id;
      const projectStaff = {
        user_id: account_id,
        project_id,
        join_date: '02-02-2020',
        exit_date: '04-02-2020',
      };
      const project_staff = await func_test.testCreateProjectStaff(projectStaff);
      expect(project_staff.project_id).to.eql(project_id);
    });
  });
});
