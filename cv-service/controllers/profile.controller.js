const profile = require('../models/profile.model').model
const db = new profile()
const account = require('../models/account.model')
const account_model = new account()
const bcrypt = require('bcryptjs')
const login = require('../models/login.model')

module.exports = {
  addCV: async (req, res) => {
    const entity = { ...req.body }
    const newCV = await db.addCV(req.account_id, entity)
    if (newCV == null) {
      res.status(500).send('Server Error')
    }
    else {
      res.status(200).send({
        location: newCV.cv.location,
        skill: newCV.cv.skill,
        old_company: newCV.exp.old_company,
        pro_language: newCV.pro_language.programming_language_name
      })
    }
  },

  showProfile: async (req, res) => {
    const result = await account_model.getByID(req.account_id)
    res.status(200).json({
      user_name: result.user_name,
      email: result.email,
      phone_numbers: result.phone_numbers,
      link_img: result.link_img
    })
  },

  editProfile: async (req, res) => {
    const entity = { ...req.body }
    const result = await account_model.updateAccount(req.account_id, entity)
    if (result) {
      res.status(200).send({
        message: 'Account is updated',
        email: result.rows[0].email,
        user_name: result.rows[0].user_name,
        phone_numbers: result.rows[0].phone_numbers,
        link_img: result.rows[0].link_img
      })
    }
    else {
      res.status(200).send({ message: 'Server Error' })
    }
  },

  changePassword: async (req, res) => {
    const { old_password, new_password } = req.body
    const acc = await account_model.getByID(req.account_id)
    const result = bcrypt.compareSync(old_password, acc.password)
    if (result) {
      const hash = bcrypt.hashSync(new_password, 8)
      await login.updatePassword(req.account_id, hash)
      res.send({ message: 'Password is updated' })
    }
    else {
      res.status(200).send({ message: 'Password is not correct' })
    }
  },

  viewByTagName: async (req, res) => {
    const { tagname } = req.params
    const list = await db.viewByTagName(tagname)
    return res.status(200).json(list.map((item) => {
      return {
        account_id: item.account_id,
        user_name: item.user_name,
        email: item.email,
        phone_numbers: item.phone_numbers
      }
    }))
  }
}
