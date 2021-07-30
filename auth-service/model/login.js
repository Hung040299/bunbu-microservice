const bcrypt = require('bcrypt');
const pool = require('./db');
const Usermodel = require('./user');

const db = new Usermodel();

const queryCheckLogin = async (user_email, user_password) => {
  const password = await pool.query('select user_password from UserBunbu where user_email=$1', [user_email]);
  const comparehash = bcrypt.compareSync(user_password, password.rows[0].user_password);
  if (comparehash) {
    return comparehash;
  }

  return false;
};
function model() { }
model.prototype = {
  loginUser: async (user_email, user_password) => {
    const user = await db.findByEmail(user_email);
    if (user) {
      if (await queryCheckLogin(user_email, user_password)) { return user; }
      return false;
    }

    return false;
  },
};

module.exports = model;
