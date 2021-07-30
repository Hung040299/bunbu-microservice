const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');

chai.should();
chai.use(chaiHttp);
const Skill = require('../../model/skill');

const model = new Skill();
const data = require('../mocks/skill_mocks');

const Skill_test = require('../lib/skill');

const func_test = new Skill_test();
process.env.NODE_ENV === 'test';

const entity = {
  skill_name: 'JS',
};

describe('model skill', () => {
  describe('create skill', () => {
    beforeEach(async () => {
      await func_test.resetTable();
    });

    it('create skill', async () => {
      data.forEach((item) => {
        func_test.testCreateSkill(item);
      });
      const Skill = await model.createSkill(entity);
      expect(Skill.skill_name).to.eql('JS');
    });
  });

  describe('find skill by id', () => {
    beforeEach(async () => {
      await func_test.resetTable();
    });
    it('find skill by id', async () => {
      data.forEach((item) => {
        func_test.testCreateSkill(item);
      });
      const skill_data = await func_test.testCreateSkill(entity);
      const skill_id = await skill_data.skill_id;
      const result = await model.findSkillById(skill_id);
      expect(result.skill_name).to.eql('JS');
    });
  });

  describe('edit skill', () => {
    beforeEach(async () => {
      await func_test.resetTable();
    });
    it('edit skill', async () => {
      const data = {
        skill_name: 'tin hoc van phong',
      };
      const skill_data = await model.createSkill(entity);
      const skill_id = await skill_data.skill_id;
      const result = await model.editSkill(skill_id, data);
      expect(result.skill_name).to.eql('tin hoc van phong');
    });
  });
});
