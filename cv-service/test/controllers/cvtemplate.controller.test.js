
const request = require('supertest')
const app = require('../appTest')
const jwtservice = require('../../config/jwt.service')
const register = require('../../models/dbPostgreSQL')
const register_model = new register()
const account_test = require('../lib/account')
const func_test = new account_test()
const cvtemplate = require('../../models/cvtemplate.model')
const cvtemplate_model = new cvtemplate()

let token
process.env.NODE_ENV === 'test'

describe("Test GET/:cvtemplateid API", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test show cvTemplate api", async () => {
    let data = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 1
    }

    let CV = {
      location: 'Ha Noi',
      skill: 'PHP',
      product: 'new PJ',
      old_company: 'MTA',
      programming_language_template_name: 'PHP'
    }

    return register_model.register(data, async (id) => {
      token = jwtservice.sign({ account_id: id })
      const cv = await cvtemplate_model.addCV(id, CV)
      const response = await request(app)
        .get(`/admin/cvtemplates/${cv.cv.cv_template_id}`)
        .set('x-access-token', `${token}`)
      expect(response.statusCode).toBe(200)
      expect(response.body.location).toEqual("Ha Noi")
    })
  })

});

describe("Test PUT/:cvtemplateid API", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test edit cvTemplate api", async () => {
    let data = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 1
    }

    let CV = {
      location: 'Ha Noi',
      skill: 'PHP',
      product: 'new PJ',
      old_company: 'MTA',
      programming_language_template_name: 'PHP'
    }

    let cvEdit = {
      location: 'Phu Tho',
      skill: 'PHP',
      product: 'new PJ',
      old_company: 'MTA',
      programming_language_template_name: 'PHP'
    }
    return register_model.register(data, async (id) => {
      token = jwtservice.sign({ account_id: id })
      const cv = await cvtemplate_model.addCV(id, CV)
      return request(app)
        .put(`/admin/cvtemplates/${cv.cv.cv_template_id}`)
        .set('x-access-token', `${token}`)
        .send(cvEdit)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          expect(response.body.location).toEqual("Phu Tho")
        })
    })
  })
});

describe("Test GET cvTemplate API", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test show list cvTemplate api", async () => {
    let data = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 1
    }

    let CV = [
      {
        location: 'Ha Noi',
        skill: 'PHP',
        product: 'new PJ',
        old_company: 'MTA',
        programming_language_template_name: 'PHP'
      },
      {
        location: 'Ha Noi',
        skill: 'PHP',
        product: 'new PJ',
        old_company: 'MTA',
        programming_language_template_name: 'PHP'
      }
    ]

    return register_model.register(data, async (id) => {
      token = jwtservice.sign({ account_id: id })
      await cvtemplate_model.addCV(id, CV[0])
      await cvtemplate_model.addCV(id, CV[1])
      return request(app)
        .get('/admin/cvtemplates')
        .set('x-access-token', `${token}`)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          expect(response.body.length).toEqual(2)
          expect(response.body[0].skill).toEqual('PHP')
        })
    })
  })

});

describe("Test DELETE/:cvtemplateid CV API", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test delete cvTemplate (TRUE) api", async () => {
    let data = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 1
    }

    let CV = {
      location: 'Ha Noi',
      skill: 'PHP',
      product: 'new PJ',
      old_company: 'MTA',
      programming_language_name: 'PHP'
    }

    return register_model.register(data, async (id) => {
      token = jwtservice.sign({ account_id: id })
      const cv = await cvtemplate_model.addCV(id, CV)
      return request(app)
        .delete(`/admin/cvtemplates/${cv.cv.cv_template_id}`)
        .set('x-access-token', `${token}`)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          expect(response.body.message).toEqual('CV is deleted')
        })
    })
  })

});
