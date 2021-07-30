const chai = require('chai');

const { expect } = chai;
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = require('../appTest');
const Func_test = require('../lib/user');

chai.should();
const model = new Func_test();
const account = require('../mocks/user_mocks');
const Usermodel = require('../../model/user');

const findUser = new Usermodel();
chai.use(chaiHttp);
process.env.NODE_ENV = 'test';
let access_token;
describe('account', () => {
  describe('/POST create account', () => {
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
    it('create successfully', () => {
      const entity = {
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
      chai.request(app)
        .post('/api/account/create_account')
        .set('access_token', `${access_token}`)
        .send(entity)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('ok');
          res.body.should.have.property('profile_phone').eql('0239487567');
          res.body.should.have.property('user_email').eql('user@gmail.com');
        });
    });
    it('create error', () => {
      const entity = {
        user_email: 'user@gmail.com',
      };
      chai.request(app)
        .post('/api/account/create_account')
        .set('access_token', access_token)
        .send(entity)
        .end((err, res) => {
          res.body.should.have.property('message').eql('Email already exists');
        });
    });
  });

  describe('/GET/:roles_id list account', () => {
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
    it('successfully', () => {
      account.forEach((item) => {
        model.testCreateAccount(item);
      });
      const roles_id = 2;
      chai.request(app)
        .get(`/api/account/list_account/:${roles_id}`)
        .set('access_token', access_token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          expect(res.body.length).toBe(2);
        });
    });
    it('error', () => {
      account.forEach((item) => {
        model.testCreateAccount(item);
      });
      const roles_id = 100;
      chai.request(app)
        .get(`/api/account/list_account/:${roles_id}`)
        .set('access_token', access_token)
        .end((err, res) => {
          res.body.should.have.property('message').eql('Access is not allowed');
        });
    });
  });

  describe('/GET/:user_email find by email', () => {
    beforeEach(async () => {
      await model.resetTable();
    });
    it('find by email error', async () => {
      account.forEach((item) => {
        model.testCreateAccount(item);
      });
      const user = { user_email: 'g@gmail.com' };
      chai.request(app)
        .post('/api/account/find_email/')
        .send(user)
        .end((err, res) => {
          res.body.should.have.property('message').eql('user not found');
        });
    });
    it('find by email successfully', async () => {
      account.forEach((item) => {
        model.testCreateAccount(item);
      });
      const user = { user_email: 'user@gmail.com' };
      chai.request(app)
        .post('/api/account/find_email/')
        .send(user)
        .end((err, res) => {
          console.log(res.body);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('ok');
          res.body.should.have.property('user_code').eql('B09235');
          res.body.should.have.property('user_email').eql('user@gmail.com');
        });
    });
  });

  describe('/PUT/:user_id edit account', () => {
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
      await model.resetTable();
      await model.testCreateAccount(user);
      access_token = jwt.sign({ id: user.user_email }, process.env.SECRET);
    });
    it('edit successfully', async () => {
      const entity = {
        user_code: 'B09235',
        user_password: '123456',
        user_email: '123@gmail.com',
        joining_date: '02-02-2020',
        official_date: '02-02-2020',
        contact_type: 'phone',
        position: 'staff',
        id_card: '1',
        roles_id: '2',
        avatar: 'null',
        profile_name: 'hung',
        profile_phone: '0239487567',
        profile_address: 'abc',
        sex: 'nam',
        date_of_birth: '02-02-2020',
      };
      const account = {
        user_code: 'B923',
        user_password: '123456',
        user_email: '123@gmail.com',
        joining_date: '02-02-2020',
        official_date: '02-02-2020',
        contact_type: 'phone',
        position: 'staff',
        id_card: '1',
      };
      const user = await model.testCreateAccount(entity);
      const user_id = await user.account.user_id;
      console.log(user_id);
      entity.user_password = bcrypt.hashSync(entity.user_password, 6);
      chai.request(app)
        .put(`/api/account/edit_account/:${user_id}`)
        .set('access_token', access_token)
        .send(account)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('ok');
          res.body.should.have.property('user_id').eql(user_id);
          res.body.should.have.property('user_code').eql('B923');
          res.body.should.have.property('user_email').eql('123@gmail.com');
        });
    });
    it('edit error', () => {
      const entity = {
        user_code: 'B09235',
        user_password: '123456',
        user_email: 'hung@gmail.com',
        joining_date: '02-02-2020',
        official_date: '02-02-2020',
        contact_type: 'phone',
        position: 'staff',
        id_card: '1',
        roles_id: '2',
        avatar: 'null',
        profile_name: 'hung',
        profile_phone: '0239487567',
        profile_address: 'abc',
        sex: 'nam',
        date_of_birth: '02-02-2020',
      };
      const account = {
        user_password: '123412',
        user_email: 'agujfhsud@gmail.com',
      };
      const user_id = 1090000;
      model.testCreateAccount(entity);
      chai.request(app)
        .put(`/api/account/edit_account/:${user_id}`)
        .set('access_token', access_token)
        .send(entity, account)
        .end((err, res) => {
          res.body.should.have.property('message').eql('edit failed');
        });
    });
  });

  describe('/DELETE/:user_id delete account', () => {
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
    it('Could not find a user to delete', async () => {
      account.forEach((item) => {
        model.testCreateAccount(item);
      });
      const user_id = 1090000;
      model.testDeleteAccount(user_id);
      chai.request(app)
        .delete(`/api/account/delete_account/:${user_id}`)
        .set('access_token', access_token)
        .end((err, res) => {
          res.body.should.have.property('message').eql('Could not find a user to delete');
        });
    });
    it('deleted successfully', () => {
      const entity = {
        user_code: 'B9235',
        user_password: '123456',
        user_email: '12134@gmail.com',
        joining_date: '02-02-2020',
        official_date: '02-02-2020',
        contact_type: 'phone',
        position: 'staff',
        id_card: '1',
        roles_id: '1',
      };
      const { user_id } = model.testCreateAccount(entity);
      model.testDeleteAccount(user_id);
      chai.request(app)
        .delete(`/api/account/delete_account/:${user_id}`)
        .set('access_token', access_token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('deleted successfully');
        });
    });
  });
});
