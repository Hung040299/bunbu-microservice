const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const app = require('../appTest');
const Func_test = require('../lib/user');

const model = new Func_test();
const account = require('../mocks/user_mocks');

chai.should();
chai.use(chaiHttp);
process.env.NODE_ENV = 'test';
let access_token;

describe('profile', () => {
  describe('/GET/:user_id show profile', () => {
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
    it('successfully', async () => {
      account.forEach((item) => {
        model.testCreateAccount(item);
      });
      const user_id = '5373';
      chai.request(app)
        .get('/api/profile/show_profile/2')
        .set('access_token', access_token)
        .send(user_id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('ok');
          res.body.should.have.property('avatar').eql('abh');
          res.body.should.have.property('profile_phone').eql('0239487567');
          res.body.should.have.property('profile_address').eql('abc');
        });
    });
    it('profile not found', async () => {
      account.forEach((item) => {
        model.testCreateAccount(item);
      });
      const user_id = '1000000000000000';
      chai.request(app)
        .get('/api/profile/show_profile/2')
        .set('access_token', access_token)
        .send(user_id)
        .end((err, res) => {
          res.body.should.have.property('message').eql('profile not found');
        });
    });
  });
});
