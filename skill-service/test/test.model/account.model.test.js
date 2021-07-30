const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');

chai.should();
chai.use(chaiHttp);
const Account = require('../../model/user');
const data = require('../mocks/user_mocks');

const model = new Account();
const User_test = require('../lib/user');

const func_test = new User_test();
process.env.NODE_ENV === 'test';

const entity = {
  user_code: 'B09285',
  user_password: '123456',
  user_email: 'hoang@gmail.com',
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

describe('model account', () => {
  describe('createAccount', () => {
    beforeEach(async () => {
      await func_test.resetTable();
    });
    it('should add a user', async () => {
      data.forEach((item) => {
        func_test.testCreateAccount(item);
      });
      const acc = await func_test.testCreateAccount(entity);
      expect(acc.account.user_code).to.eql('B09285');
    });
  });

  describe('getlistAccount', () => {
    beforeEach(async () => {
      await func_test.resetTable();
      data.forEach(async (item) => {
        await func_test.testCreateAccount(item);
      });
    });

    it('list account', async () => {
      const roles_id = 1;
      const acc = await model.getlistAccount(roles_id);
      console.log(acc);
      expect(acc).to.have.length(2);
    });
  });

  describe('findByEmail', () => {
    beforeEach(async () => {
      await func_test.resetTable();
    });

    it('find By Email', async () => {
      data.forEach((item) => {
        func_test.testCreateAccount(item);
      });
      const user_email = await (await func_test.testCreateAccount(entity)).account.user_email;
      const acc = await model.findByEmail(user_email);
      expect(acc.user_code).to.eql('B09285');
    });
  });

  describe('findById', () => {
    beforeEach(async () => {
      await func_test.resetTable();
    });

    it('find By Id', async () => {
      data.forEach((item) => {
        func_test.testCreateAccount(item);
      });
      const user_id = await (await func_test.testCreateAccount(entity)).account.user_id;
      const acc = await model.findById(user_id);

      expect(acc.user_code).to.eql('B09285');
    });
  });

  describe('editAccount', () => {
    beforeEach(async () => {
      await func_test.resetTable();
    });

    it('edit account', async () => {
      const user = {
        user_code: 'B00002',

      };
      const user_data = await func_test.testCreateAccount(entity);
      const user_id = await user_data.account.user_id;
      const acc = await model.editAccount(user_id, user);
      expect(acc.user_code).to.eql('B00002');
    });
  });
});
