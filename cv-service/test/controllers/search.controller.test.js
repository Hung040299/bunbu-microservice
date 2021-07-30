const register = require('../../models/dbPostgreSQL')
const register_model = new register()
const profile = require('../../models/profile.model')
const profile_model = new profile.model()
const cvs = require('../../models/cv.model')
const cv_model = new cvs()
const account_test = require('../lib/account');
const func_test = new account_test()
const request = require('supertest')
const app = require('../appTest')
const jwtservice = require('../../config/jwt.service');
let token
process.env.NODE_ENV === 'test'

describe("Test search CV by Tagname API ", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test search CV by Tagname API", async () => {
    let user = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 2
    };
    let admin = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "admin@gmail.com",
      link_img: 'url',
      role_id: 1
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
    return register_model.register(user, (result) => {
      return result
    })
      .then(async (data) => {
        const newCV = await profile_model.addCV(data, CV)
        await cv_model.addTagName(newCV.cv.cv_id, tag_name)
        await register_model.register(admin, (account_id) => {
          token = jwtservice.sign({ account_id: account_id })
        })
      })
      .then(() => {
        return request(app)
          .get(`/search/cv/tagname/viet`)
          .set('x-access-token', `${token}`)
          .then((response) => {
            expect(response.body[0].location).toEqual("Viet Nam")
          })
      })
  })

})

describe("Test search CV by Location API ", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test search CV by Location API", async () => {
    let user = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 2
    };
    let admin = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "admin@gmail.com",
      link_img: 'url',
      role_id: 1
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
    return register_model.register(user, async (result) => {
      const newCV = await profile_model.addCV(result, CV)
      return result
    })
      .then(async () => {
        await register_model.register(admin, (account_id) => {
          token = jwtservice.sign({ account_id: account_id })
        })
        return request(app)
          .get(`/search/cv/location/viet`)
          .set('x-access-token', `${token}`)
          .then((response) => {
            expect(response.body[0].location).toEqual("Viet Nam")
          })
      })
  })

})

