const cvs = require('../models/cv.model')
const cv_model = new cvs()
const profiles = require('../models/profile.model')
const CsvParser = require('json2csv').Parser

module.exports = {
  editCV: async (req, res) => {
    try {
      const { cvid } = req.params
      const entity = { ...req.body }
      const cv = await cv_model.showCV(cvid)
      if (req.account_id == cv.user_role_id) {
        const cvUpdate = await cv_model.editCV(cvid, entity)
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
      else {
        res.status(401).send({ message: "ACCESS DENIED" })
      }
    }
    catch {
      res.status(400).send({ message: "CV not found" })
    }

  },

  showCV: async (req, res) => {
    try {
      const { cvid } = req.params
      const cv = await cv_model.showCV(cvid)
      await cv_model.updateViewCount(cvid)
      res.status(200).json({
        cv_id: cv.cv_id,
        location: cv.location,
        skill: cv.skill,
        product: cv.product,
        link_img: cv.link_img,
        old_company: cv.old_company,
        pro_language: cv.programming_language_name
      })
    }
    catch {
      res.status(400).send({ message: 'CV not found' })
    }
  },

  downloadCV: async (req, res) => {
    try {
      const { cvid } = req.params
      const cv = await cv_model.showCV(cvid)
      const cvFields = ['cv_id', 'location', 'skill', 'product', 'link_img', 'old_company', 'programming_language_name']
      const csvParser = new CsvParser({ cvFields })
      const csvData = csvParser.parse(cv)
      const profile = await cv_model.getProfileByCV(cvid)
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', `attachment; filename = ${profile.user_name}-CV.csv`)
      res.send(csvData)
    }
    catch {
      res.status(500).send({ message: 'Download Fail' })
    }
  },

  deleteCV: async (req, res) => {
    const { cvid } = req.params
    const result = await cv_model.deleteCV(cvid)
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
        pro_language: item.programming_language_name
      }
    }))
  },

  likeCV: async (req, res) => {
    const { cvid } = req.params
    const result = await cv_model.addLike(req.account_id, cvid)
    if (result) {
      res.status(200).send({ message: 'Liked' })
    }
    else {
      res.status(500).send({ message: 'Like Fail' })
    }
  },

  addTagName: async (req, res) => {
    const { cvid } = req.params
    const { tag_name } = req.body
    const cv = await cv_model.showCV(cvid)
    if (req.account_id == cv.user_role_id) {
      const result = await cv_model.addTagName(cvid, tag_name)
      if (result) {
        res.status(200).send({
          message: 'Add Success',
          tag_name: result.tag_name
        })
      }
      else {
        res.status(500).send({ message: 'Add Fail' })
      }
    }
    else {
      res.status(401).send({ message: 'ACCESS DENIED' })
    }
  },

  mostView: async (req, res) => {
    const allCV = await cv_model.mostView()
    return res.status(200).json(allCV.map((item) => {
      return {
        cv_id: item.cv_id,
        location: item.location,
        skill: item.skill,
        product: item.product,
        link_img: item.link_img,
        old_company: item.old_company,
        pro_language: item.programming_language_name
      }
    }))
  },

  searchByTagName: async (req, res) => {
    const { tagname } = req.params
    const allCV = await cv_model.searchByTagName(tagname)
    return res.status(200).json(allCV.map((item) => {
      return {
        cv_id: item.cv_id,
        location: item.location,
        skill: item.skill,
        product: item.product,
        link_img: item.link_img,
        old_company: item.old_company,
        pro_language: item.programming_language_name
      }
    }))
  },

  searchByLocation: async (req, res) => {
    const { location } = req.params
    const allCV = await cv_model.serchByLocation(location)
    return res.status(200).json(allCV.map((item) => {
      return {
        cv_id: item.cv_id,
        location: item.location,
        skill: item.skill,
        product: item.product,
        link_img: item.link_img,
        old_company: item.old_company,
        pro_language: item.programming_language_name
      }
    }))
  }
}
