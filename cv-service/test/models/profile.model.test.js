const register = require('../../models/dbPostgreSQL')
const register_model = new register()
const profile = require('../../models/profile.model')
const db = new profile.model()
const account_test = require('../lib/account');
const func_test = new account_test()
const cvs = require('../../models/cv.model')
const cv_model = new cvs()

process.env.NODE_ENV === 'test'

describe("Test Add New CV function ", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test Add new CV function (true)", async () => {
    let mockData = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 2
    };
    let CV = {
      location: 'Viet Nam',
      skill: 'Skill',
      product: 'Product',
      link_img: 'url',
      user_role_id: 1,
      old_company: 'MTA',
      programming_language_name: 'NodeJS'
    }
    return register_model.register(mockData, (result) => {
      return result
    })
      .then(async (data) => {
        CV.user_role_id = await profile.getUserRoleID(data)
        const newCV = await db.addCV(data, CV)
        expect(newCV.cv.location).toEqual('Viet Nam')
        expect(newCV.exp.old_company).toEqual('MTA')
        expect(newCV.pro_language.programming_language_name).toEqual('NodeJS')
      })
  })

  test("Test Add new CV function (null)", async () => {
    let mockData = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98h11t123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 2
    };
    let CV = {
      location: 'Viet Nam',
      skill: 'Skill',
      product: 'Product',
      link_img: 'url',
      user_role_id: 1,
      old_company: 'MTA',
      programming_language_name: 'NodeJS'
    }
    return register_model.register(mockData, (result) => {
      return result
    })
      .then(async (data) => {
        CV.user_role_id = await profile.getUserRoleID(data)
        const newCV = await db.addCV(null,CV)
        expect(newCV).toBe(null)
      })
  })

})

describe("Test view Profile by Tagname function ", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test view Profile by Tagname function", async () => {
    let mockData = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 2
    };
    let CV = {
      location: 'Viet Nam',
      skill: 'Skill',
      product: 'Product',
      link_img: 'url',
      old_company: 'MTA',
      programming_language_name: 'NodeJS'
    }
    let tag_name = 'VietTri'
    return register_model.register(mockData, (result) => {
      return result
    })
      .then(async (data) => {
        const newCV = await db.addCV(data, CV)
        const result = await cv_model.addTagName(newCV.cv.cv_id, tag_name)
        const viewProfile = await db.viewByTagName(tag_name)
        expect(viewProfile[0].phone_numbers).toEqual('0362972828')
      })
  })

})
