const express = require('express');

const app = express();
const bcrypt = require('bcrypt');
const Model = require('../model/user');
const mailServices = require('../mailer/mail_service');
const verify = require('../verify/verify');
const LoginModel = require('../model/login');

const loginUser = new LoginModel();
const db = new Model();
app.use(express.json());

function generateOTP() {
  const pattern = process.env.PATTERN;
  let otp = '';
  for (let count = 0; count < 16; count++) {
    otp += pattern[Math.floor(Math.random() * pattern.length)];
  }
  return otp;
}

module.exports = {
  async login(req, res) {
    const { user_email, user_password } = req.body;
    const user = await loginUser.loginUser(user_email, user_password);
    if (user) {
      const access_token = verify.sign({ id: user.user_id, role: user.role_id });
      res.setHeader('access_token', `${access_token}`);
      res.send({
        user_id: user.user_id,
        user_code: user.user_code,
        user_email: user.user_email,
        token: `${access_token}`,
      });
    } else {
      res.send({ message: 'false' });
    }
  },

  resetPassword: async (req, res) => {
    const { user_email } = req.body;
    const user = await db.findByEmail(user_email);
    const password = generateOTP();
    const hash = bcrypt.hashSync(password, 6);
    await mailServices.sendOTP(password, user.user_email);
    const passwordEdited = await db.editPassword(hash, user_email);
    if (passwordEdited) {
      res.send({
        message: 'A new password has been sent to your email',
        passwordEdited,
      });
    } else {
      res.send({ message: 'false' });
    }
  },

  resendEmail: async (req, res) => {
    const { user_email } = req.body;
    const user = await db.findByEmail(user_email);
    if (user) {
      if (await mailServices.resendMail(user.user_email)) {
        res.send({
          message: 'A new email confirm has been sent to your email',
        });
      } else {
        res.send({ message: 'Can not send' });
      }
    } else {
      res.send({ message: 'false' });
    }
  },

  logout: async (req, res) => {
    res.removeHeader('access_token');
  },
};
