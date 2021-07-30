const con = require('../config/postgreSql/postgreSQL');
const bcrypt = require('bcryptjs');
const jwtservice = require('../config/jwt.service')
const mailservice = require('../services/mail')

function model() { }
model.prototype = {
  logIn: async (email, password, callback) => {
    const acc = await getByEmail(email)
    if (acc) {
      const compareHash = bcrypt.compareSync(password, acc.password)
      if (compareHash) {
        const token = jwtservice.sign({ account_id: acc.account_id })
        return callback(token)
      }
      else {
        return callback(false)
      }
    }
    else {
      return callback(false)
    }
  },
  resetPassword: async (email) => {
    const account = await getByEmail(email)
    if (account == null) {
      return false
    }
    else {
      const password = generateOTP()
      const hash = bcrypt.hashSync(password, 8)
      account.password = hash
      await updatePassword(account.account_id, account.password)
      await mailservice.sendOTP(password, email)
      return true
    }
  }
};

const updatePassword = async (id, password) => {
  const query = `UPDATE accounts SET password = $1 WHERE account_id = $2`
  await con.query(query, [password, id])
}

const getByEmail = async (email) => {
  const query = 'select * from accounts where email = $1'
  const account = await con.query(query, [email])
  return account.rows[0]
}

const generateOTP = () => {
  let otp = ''
  const pattern = process.env.PATTERN_GENERATE_OTP
  for (let count = 0; count < 12; count++) {
    otp += pattern[Math.floor(Math.random() * pattern.length)]
  }
  return otp
}

module.exports = { model, getByEmail, updatePassword }
