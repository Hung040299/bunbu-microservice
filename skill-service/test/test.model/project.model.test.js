const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');

chai.use(chaiHttp);
const Project = require('../../model/project');
const data = require('../mocks/project_mocks');

chai.should();
const model = new Project();
const Data_project = require('../lib/project');

const func_test = new Data_project();
process.env.NODE_ENV === 'test';

const entity = {
  project_name: 'abcd',
  create_date: '02-02-2020',
  description: 'ab',
  deadline: '04-02-2020',
};

describe('model project', () => {
  describe('createProject', () => {
    beforeEach(async () => {
      await func_test.resetTable();
    });
    it('create project', async () => {
      data.forEach((item) => {
        func_test.testCreateProject(item);
      });
      const project = await model.createProject(entity);
      expect(project.project_name).to.eql('abcd');
    });
  });

  describe('editProject', () => {
    beforeEach(async () => {
      await func_test.resetTable();
    });
    it('edit project', async () => {
      const data = {
        project_name: 'ban hang',
      };
      const project = await model.createProject(entity);
      const project_id = await project.project_id;
      const result = await model.editProject(project_id, data);
      expect(result.project_name).to.eql('ban hang');
    });
  });

  describe('findProjectById', () => {
    beforeEach(async () => {
      await func_test.resetTable();
    });
    it('find Project By Id', async () => {
      data.forEach((item) => {
        func_test.testCreateProject(item);
      });
      const project_data = await func_test.testCreateProject(entity);
      const project_id = await project_data.project_id;
      const project = await model.findProjectById(project_id);
      expect(project.project_name).to.eql('abcd');
    });
  });
});
