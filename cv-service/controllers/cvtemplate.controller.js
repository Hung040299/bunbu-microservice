const cv_templates = require('../models/cvtemplate.model')
const cv_model = new cv_templates()
const profiles = require('../models/profile.model')

module.exports = {
  addCV: async (req, res) => {
    const entity = { ...req.body }
    const newCV = await cv_model.addCV(req.account_id, entity)
    if (newCV == null) {
      res.status(500).send('Server Error')
    }
    else {
      res.status(200).send({
        location: newCV.cv.location,
        skill: newCV.cv.skill,
        old_company: newCV.exp.old_company,
        pro_language: newCV.pro_language.programming_language_template_name
      })
    }
  },

  editCV: async (req, res) => {
    try {
      const { template_id } = req.params
      const entity = { ...req.body }
      const cvUpdate = await cv_model.editCV(template_id, entity)
      if (cvUpdate) {
        res.status(200).send({
          message: 'CV is updated',
          location: cvUpdate.cv.location,
          skill: cvUpdate.cv.skill,
          old_company: cvUpdate.exp.old_company,
          pro_language: cvUpdate.pro_language.programming_language_name
        })
      }
      else {
        res.status(500).send({ message: "Server Error" })
      }

    }
    catch {
      res.status(400).send({ message: "CV not found" })
    }

  },

  showCV: async (req, res) => {
    try {
      const { template_id } = req.params
      const cv = await cv_model.showCV(template_id)
      res.status(200).json({
        cv_id: cv.cv_template_id,
        location: cv.location,
        skill: cv.skill,
        product: cv.product,
        link_img: cv.link_img,
        old_company: cv.old_company,
        pro_language: cv.programming_language_template_name
      })
    }
    catch {
      res.status(400).send({ message: 'CV not found' })
    }
  },

  deleteCV: async (req, res) => {
    const { template_id } = req.params
    const result = await cv_model.deleteCV(template_id)
    if (result) {
      if (result.rowCount > 0) {
        res.status(200).send({ message: 'CV is deleted' })
      }
      else {
        res.status(400).send({ message: 'CV is not exist' })
      }
    }
    else {
      res.status(500).send({ message: 'Server Error' })
    }
  },

  showAllCV: async (req, res) => {
    const allCV = await cv_model.showAllCV()
    return res.status(200).json(allCV.map((item) => {
      return {
        cv_id: item.cv_id,
        location: item.location,
        skill: item.skill,
        product: item.product,
        link_img: item.link_img,
        old_company: item.old_company,
        pro_language: item.programming_language_template_name
      }
    }))
  },
}
