
const request = require('supertest')
const app = require('../appTest')
const jwtservice = require('../../config/jwt.service')
const register = require('../../models/dbPostgreSQL')
const register_model = new register()
const account_test = require('../lib/account')
const func_test = new account_test()
const profiles = require('../../models/profile.model').model
const profile_model = new profiles()
const cvs = require('../../models/cv.model')
const cv_model = new cvs()

let token
process.env.NODE_ENV === 'test'

describe("Test GET/:cvid CV API", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test showCV api", async () => {
    let data = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 2
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
      const cv = await profile_model.addCV(id, CV)
      const response = await request(app)
        .get(`/user/cvs/${cv.cv.cv_id}`)
        .set('x-access-token', `${token}`)
      expect(response.statusCode).toBe(200)
      expect(response.body.location).toEqual("Ha Noi")
    })
  })

});

describe("Test PUT/:cvid CV API", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test editCV api", async () => {
    let data = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 2
    }

    let CV = {
      location: 'Ha Noi',
      skill: 'PHP',
      product: 'new PJ',
      old_company: 'MTA',
      programming_language_name: 'PHP'
    }

    let cvEdit = {
      location: 'Phu Tho',
      skill: 'PHP',
      product: 'new PJ',
      old_company: 'MTA',
      programming_language_name: 'PHP'
    }
    return register_model.register(data, async (id) => {
      token = jwtservice.sign({ account_id: id })
      const cv = await profile_model.addCV(id, CV)
      return request(app)
        .put(`/user/cvs/${cv.cv.cv_id}`)
        .set('x-access-token', `${token}`)
        .send(cvEdit)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          expect(response.body.location).toEqual("Phu Tho")
        })
    })
  })
});

describe("Test GET CV API", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test showCV api", async () => {
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
        programming_language_name: 'PHP'
      },
      {
        location: 'Ha Noi',
        skill: 'PHP',
        product: 'new PJ',
        old_company: 'MTA',
        programming_language_name: 'PHP'
      }
    ]

    return register_model.register(data, async (id) => {
      token = jwtservice.sign({ account_id: id })
      await profile_model.addCV(id, CV[0])
      await profile_model.addCV(id, CV[1])
      return request(app)
        .get('/user/cvs')
        .set('x-access-token', `${token}`)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          expect(response.body.length).toEqual(2)
          expect(response.body[0].skill).toEqual('PHP')
        })
    })
  })

});

describe("Test DELETE/:cvid CV API", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test delete CV (TRUE) api", async () => {
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

    return await register_model.register(data, async (id) => {
      token = jwtservice.sign({ account_id: id })
      const cv = await profile_model.addCV(id, CV)
      return request(app)
        .delete(`/user/cvs/${cv.cv.cv_id}`)
        .set('x-access-token', `${token}`)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          expect(response.body.message).toEqual('CV is deleted')
        })
    })
  })

});

describe("Test GET: /company/cvs/:cvid CV API", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test likeCV api", async () => {
    let user = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 2
    }

    let CV = {
      location: 'Ha Noi',
      skill: 'PHP',
      product: 'new PJ',
      old_company: 'MTA',
      programming_language_name: 'PHP'
    }

    let company = {
      user_name: 'company',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "company@gmail.com",
      link_img: 'url',
      role_id: 3
    }
    return register_model.register(user, async (id) => {
      const cv = await profile_model.addCV(id, CV)
      return register_model.register(company, (account_id) => {
        token = jwtservice.sign({ account_id: account_id })
        return request(app)
          .get(`/company/cvs/${cv.cv.cv_id}`)
          .set('x-access-token', `${token}`)
          .then((response) => {
            expect(response.body.message).toEqual("Liked")
          })
      })

    })
  })
});

describe("Test POST: /user/cvs/:cvid CV API", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test add TagName api", async () => {
    let user = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 3
    }

    let CV = {
      location: 'Ha Noi',
      skill: 'PHP',
      product: 'new PJ',
      old_company: 'MTA',
      programming_language_name: 'PHP'
    }

    const tag_name = 'NodeJS'

    return register_model.register(user, async (id) => {
      const cv = await profile_model.addCV(id, CV)
      token = jwtservice.sign({ account_id: id })
      return request(app)
        .get(`/company/cvs/${cv.cv.cv_id}`)
        .set('x-access-token', `${token}`)
        .send(tag_name)
        .then((response) => {
          expect(response.body.message).toEqual("Liked")
        })
    })
  })
});

describe("Test GET:/themostviewedcv", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test themostviewedcv api", async () => {
    let user = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 2
    }

    let CV = [
      {
        location: 'Ha Noi',
        skill: 'PHP',
        product: 'new PJ',
        old_company: 'MTA',
        programming_language_name: 'PHP'
      },
      {
        location: 'Ha Noi',
        skill: 'JAVA',
        product: 'new PJ',
        old_company: 'MTA',
        programming_language_name: 'PHP'
      }
    ]

    let company = {
      user_name: 'company',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "company@gmail.com",
      link_img: 'url',
      role_id: 3
    }
    return register_model.register(user, async (id) => {
      const cv1 = await profile_model.addCV(id, CV[0])
      const cv2 = await profile_model.addCV(id, CV[1])
      await cv_model.updateViewCount(cv2.cv.cv_id)
      return register_model.register(company, (account_id) => {
        token = jwtservice.sign({ account_id: account_id })
        return request(app)
          .get('/themostviewedcv')
          .set('x-access-token', `${token}`)
          .then((response) => {
            expect(response.body.length).toEqual(2)
            expect(response.body[0].skill).toEqual('JAVA')
          })
      })

    })
  })
});
