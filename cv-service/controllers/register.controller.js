const model = require('../models/dbPostgreSQL');
const jwtservice = require('../config/jwt.service');
const bcrypt = require('bcryptjs');


const db = new model();

function register(req, res) {
  let hash = bcrypt.hashSync(req.body.password, 8);
  const entity = { ...req.body, password: hash }
  db.checkExistByEmail(entity, (result) => {
    if (result) {
      db.register(entity, (account_id) => {
        if (account_id > 0) {
          let token = jwtservice.sign({ account_id: account_id })

          return res.status(200).send({
            Token: `${token}`,
            Role: `${entity.role_id}`
          })
        }
        else if (account_id == null) {
          return res.send({ message: 'Can not create Role' })
        }
        else {
          return res.send({ message: 'Can not create account' })
        }
      });
    } else {
      res.status(400).send({
        message: 'Invalid username/password supplied'
      })
    }
  });
}

module.exports = register;
