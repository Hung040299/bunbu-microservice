const { Client } = require('pg');
require('dotenv').config()

const db = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
}

const db_test = {
  user: process.env.DB_USER_TEST,
  host: process.env.DB_HOST_TEST,
  database: process.env.DB_NAME_TEST,
  password: process.env.DB_PASSWORD_TEST,
  port: process.env.DB_PORT_TEST,
  ssl: { rejectUnauthorized: false }
}
let con
if (process.env.NODE_ENV === 'test') {
  con = new Client(db_test)
}
else {
  con = new Client(db)
}

con.connect();

module.exports = con;
