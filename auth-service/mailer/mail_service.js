require('dotenv').config();
const nodemailer = require('nodemailer');

const TRANSPORTER = nodemailer.createTransport({
  host: process.env.HOST_MAIL,
  port: process.env.PORT,
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.PASS_MAIL,
  },
});

module.exports = {
  sendOTP: async (otp, user_email) => {
    try {
      await TRANSPORTER.sendMail({
        from: 'huongbui<dinhmanhhung1412@gmail.com>',
        to: user_email,
        subject: 'Change password',
        html: `<p>New password : <strong style="background-color:yellow;">${otp}</strong></p>`,
      });
    } catch (error) {
      console.log(error);
    }
  },

  resendMail: async (user_email) => {
    try {
      await TRANSPORTER.sendMail({
        from: 'huongbui<dinhmanhhung1412@gmail.com>',
        to: user_email,
        subject: 'Confirm email',
        html: '<a href="https://app.slack.com/client/THNTDHE9G/CJ087A4UV">Confirm Email</a>',
      });
      return true;
    } catch {
      return false;
    }
  },
};
