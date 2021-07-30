const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = require('../appTest');
const Func_test = require('../lib/user');

chai.should();
const model = new Func_test();
const Data = require('../../model/login');

const datalogin = new Data();
chai.use(chaiHttp);
process.env.NODE_ENV = 'test';

describe('login', () => {
  describe('/POST login', () => {
    beforeEach(async () => {
      await model.resetTable();
    });
    it('login successfully', () => {
      const entity = {
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
      entity.user_password = bcrypt.hashSync(entity.user_password, 6);
      model.testCreateAccount(entity);
      datalogin.loginUser(entity.user_email, entity.user_password);
      const access_token = jwt.sign({ id: entity.user_email }, process.env.SECRET);
      chai.request(app)
        .post('/api/auth/sign_in')
        .set('access_token', `${access_token}`)
        .send(entity)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
        });
    });
    it('email is wrong', () => {
      const entity = {
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
      const user = {
        user_email: '123adg@gmail.com',
        user_password: '123456',
      };
      entity.user_password = bcrypt.hashSync(entity.user_password, 6);
      model.testCreateAccount(entity);
      datalogin.loginUser(entity.user_email, entity.user_password);
      const access_token = jwt.sign({ id: entity.user_email }, process.env.SECRET);
      chai.request(app)
        .post('/api/auth/sign_in')
        .set('access_token', access_token)
        .send(user)
        .end((err, res) => {
          res.body.should.have.property('message').eql('false');
        });
    });
  });

  describe('/POST reset password', () => {
    beforeEach(async () => {
      await model.resetTable();
    });
    it('it should POST reset password successfully', () => {
      const entity = {
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
      const password = {
        user_password: '1231234',
        user_email: 'adg@gmail.com',
      };
      entity.user_password = bcrypt.hashSync(entity.user_password, 6);
      model.testCreateAccount(entity);
      datalogin.loginUser(entity.user_email, entity.user_password);
      const access_token = jwt.sign({ id: entity.user_email }, process.env.SECRET);
      chai.request(app)
        .post('/api/auth/reset_password')
        .set('access_token', `${access_token}`)
        .send(password)
        .end((err, res) => {
          res.body.should.have.property('message').eql('A new password has been sent to your email');
        });
    });

    it('password cannot be changed', async () => {
      const entity = {
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
      const password = {
        user_email: '123adg@gmail.com',
        user_password: '123348',
      };
      entity.user_password = bcrypt.hashSync(entity.user_password, 6);
      await model.testCreateAccount(entity);
      await datalogin.loginUser(entity.user_email, entity.user_password);
      const access_token = jwt.sign({ id: entity.user_email }, process.env.SECRET);
      chai.request(app)
        .post('/api/auth/reset_password')
        .set('access_token', `${access_token}`)
        .send(password)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('false');
        });
    });
  });

  describe('/POST resend email', () => {
    beforeEach(async () => {
      await model.resetTable();
    });
    it('it should POST resend email successfully', async () => {
      const entity = {
        user_code: 'B09535',
        user_password: '123456',
        user_email: 'hung@gmail.com',
        joining_date: '02-02-2020',
        official_date: '02-02-2020',
        contact_type: 'phone',
        position: 'staff',
        id_card: '1',
        roles_id: '2',
      };
      const mail = {
        user_email: 'hung@gmail.com',
      };
      entity.user_password = bcrypt.hashSync(entity.user_password, 6);
      await model.testCreateAccount(entity);
      chai.request(app)
        .post('/api/auth/resend_email')
        .send(mail)
        .end((err, res) => {
          res.body.should.have.property('message').eql('A new email confirm has been sent to your email');
        });
    });

    it('resend email error', async () => {
      const entity = {
        user_code: 'B09535',
        user_password: '123456',
        user_email: 'hung@gmail.com',
        joining_date: '02-02-2020',
        official_date: '02-02-2020',
        contact_type: 'phone',
        position: 'staff',
        id_card: '1',
        roles_id: '2',
      };
      const mail = {
        user_email: 'asgiiyeg@gmail.com',
      };
      entity.user_password = bcrypt.hashSync(entity.user_password, 6);
      await model.testCreateAccount(entity);
      await datalogin.loginUser(entity.user_email, entity.user_password);
      const access_token = jwt.sign({ id: entity.user_email }, process.env.SECRET);
      chai.request(app)
        .post('/api/auth/resend_email')
        .set('access_token', `${access_token}`)
        .send(mail)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('false');
        });
    });
  });
});
