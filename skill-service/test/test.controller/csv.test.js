const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const app = require('../appTest');
const Func_test = require('../lib/user');

chai.should();
const model = new Func_test();
const account = require('../mocks/project_mocks');
const Project = require('../lib/project');

const project_test = new Project();
const { assert } = chai;
chai.use(chaiHttp);
process.env.NODE_ENV = 'test';
let access_token;

describe('cvs', () => {
  describe('/GET project csv ', () => {
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
    function binaryParser(res, callback) {
      res.setEncoding('binary');
      res.data = '';
      res.on('data', (chunk) => {
        res.data += chunk;
      });
      res.on('end', () => {
        callback(null, new Buffer.from(res.data, 'binary'));
      });
    }
    it('get csv', () => {
      account.forEach((item) => {
        project_test.testCreateProject(item);
      });
      chai.request(app)
        .get('/api/csv/export_csv')
        .set('Content-Type', 'text/csv')
        .set('Content-Disposition', 'attachment; filename = project.csv')
        .set('access_token', `${access_token}`)
        .buffer()
        .parse(binaryParser)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          assert.isOk(Buffer.isBuffer(res.body));
        });
    });
  });

  describe('/GET csv skill all user ', () => {
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
    function binaryParser(res, callback) {
      res.setEncoding('binary');
      res.data = '';
      res.on('data', (chunk) => {
        res.data += chunk;
      });
      res.on('end', () => {
        callback(null, new Buffer.from(res.data, 'binary'));
      });
    }
    it('get csv skill all user', () => {
      account.forEach((item) => {
        project_test.testCreateProject(item);
      });
      chai.request(app)
        .get('/api/csv/skill_user')
        .set('Content-Type', 'text/csv')
        .set('Content-Disposition', 'attachment; filename = skill_user.csv')
        .set('access_token', `${access_token}`)
        .buffer()
        .parse(binaryParser)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          assert.isOk(Buffer.isBuffer(res.body));
        });
    });
  });

  describe('/GET csv project all user ', () => {
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
    function binaryParser(res, callback) {
      res.setEncoding('binary');
      res.data = '';
      res.on('data', (chunk) => {
        res.data += chunk;
      });
      res.on('end', () => {
        callback(null, new Buffer.from(res.data, 'binary'));
      });
    }
    it('get csv skill all user', () => {
      account.forEach((item) => {
        project_test.testCreateProject(item);
      });
      chai.request(app)
        .get('/api/csv/project_skill')
        .set('Content-Type', 'text/csv')
        .set('Content-Disposition', 'attachment; filename = project_skill.csv')
        .set('access_token', `${access_token}`)
        .buffer()
        .parse(binaryParser)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          assert.isOk(Buffer.isBuffer(res.body));
        });
    });
  });

  describe('/GET csv project all user ', () => {
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
    function binaryParser(res, callback) {
      res.setEncoding('binary');
      res.data = '';
      res.on('data', (chunk) => {
        res.data += chunk;
      });
      res.on('end', () => {
        callback(null, new Buffer.from(res.data, 'binary'));
      });
    }
    it('get csv all user', () => {
      account.forEach((item) => {
        project_test.testCreateProject(item);
      });
      chai.request(app)
        .get('/api/csv/user')
        .set('Content-Type', 'text/csv')
        .set('Content-Disposition', 'attachment; filename = user.csv')
        .set('access_token', `${access_token}`)
        .buffer()
        .parse(binaryParser)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          assert.isOk(Buffer.isBuffer(res.body));
        });
    });
  });
});
