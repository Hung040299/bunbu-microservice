const nodemailer = require('nodemailer')
require('dotenv').config()

let transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

module.exports = {
  sendOTP: async (otp, email) => {
    try {
      await transporter.sendMail({
        from: "Bunbu_Soft<dinhmanhhung1412@gmail.com>",
        to: email,
        subject: "Reset Password",
        html: `<p>Your new password is: <strong style="background-color:yellow;">${otp}</strong></p>`,
      });
    } catch (error) {
      console.error(error);
    }
  },
};
