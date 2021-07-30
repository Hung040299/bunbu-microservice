const { Pool } = require('pg');
require('dotenv').config();

const db_test = {
  user: process.env.DB_USER_TEST,
  host: process.env.DB_HOST_TEST,
  database: process.env.DB_NAME_TEST,
  password: process.env.DB_PASSWORD_TEST,
  port: process.env.DB_PORT_TEST,
  // ssl: { rejectUnauthorized: false },
};
const db = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

let pool;
if (process.env.NODE_ENV === 'test') {
  pool = new Pool(db_test);
} else {
  pool = new Pool(db);
}
pool.connect();
module.exports = pool;
