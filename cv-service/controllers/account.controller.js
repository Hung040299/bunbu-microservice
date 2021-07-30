const model = require('../models/account.model')
const db = new model()
const bcrypt = require('bcryptjs');
const model_register = require('../models/dbPostgreSQL');
const db_register = new model_register()

module.exports = {
  listAccount: async (req, res) => {
    db.listAccount((result) => {
      return res.status(200).json(result.rows.map((item) => {
        return {
          account_id: item.account_id,
          user_name: item.user_name,
          email: item.email,
          phone_numbers: item.phone_numbers
        }
      }))
    })
  },
  getByID: async (req, res) => {
    const { id } = req.params
    const account = await db.getByID(id)
    return res.status(200).json({
      account_id: account.account_id,
      user_name: account.user_name,
      email: account.email,
      phone_numbers: account.phone_numbers
    })
  },

  createAccount: async (req, res) => {
    let hash = bcrypt.hashSync(req.body.password, 8);
    const entity = { ...req.body, password: hash }
    db_register.checkExistByEmail(entity, (result) => {
      if (result) {
        db_register.register(entity, (account_id) => {
          if (account_id > 0) {
            return res.status(200).send({ message: 'Create success' })
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
    })
  },

  deleteAccount: async (req, res) => {
    const { id } = req.params
    const result = await db.deleteAccount(id)
    if (result) {
      if (result.rowCount > 0) {
        res.status(200).send({ message: 'Account is deleted' })
      }
      else {
        res.send({ message: 'Account is not exist' })
      }
    }
    else {
      res.send({ message: 'Server Error' })
    }
  },

  updateAccount: async (req, res) => {
    const { id } = req.params
    const entity = { ...req.body }
    const account = await db.updateAccount(id, entity)
    if (account) {
      if (account.rowCount > 0) {
        res.status(200).send({
          message: 'Account is updated',
          email: account.rows[0].email,
          user_name: account.rows[0].user_name,
          phone_numbers: account.rows[0].phone_numbers
        })
      }
      else {
        res.send({ message: 'Account is not exist' })
      }
    }
    else {
      res.send({ message: 'Server Error' })
    }
  }
}
