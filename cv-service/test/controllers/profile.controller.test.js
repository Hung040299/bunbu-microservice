const register = require('../../models/dbPostgreSQL')
const register_model = new register()
const profile = require('../../models/profile.model')
const account_test = require('../lib/account');
const func_test = new account_test()
const request = require('supertest')
const app = require('../appTest')
const jwtservice = require('../../config/jwt.service');
const bcrypt = require('bcryptjs')

let token
process.env.NODE_ENV === 'test'

describe("Test Add New CV API ", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test Add new CV API (true)", async () => {
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
      token = jwtservice.sign({ account_id: result })
      return result
    })
      .then(async (data) => {
        CV.user_role_id = await profile.getUserRoleID(data)
        return request(app)
          .post('/user/cvs')
          .set('x-access-token', token)
          .send(CV)
          .then((response) => {
            expect(response.body.location).toEqual('Viet Nam')
            expect(response.body.old_company).toEqual('MTA')
          })
      })
  })

  test("Test Add new CV API (false)", async () => {
    let mockData = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
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
    return register_model.register(mockData, (result) => {
      token = jwtservice.sign({ account_id: result })
      return result
    })
      .then(async (data) => {
        return request(app)
          .post('/user/cvs')
          .set('x-access-token', token)
          .send(CV)
          .then((response) => {
            expect(response.body.message).toEqual('ACCESS DENIED')
          })
      })
  })

})

describe("Test GET/:id profile API", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test GET/:id profile api", async () => {
    let data = {
      user_name: "Nguyen Trung Nguyen 253",
      password: "19121998",
      phone_numbers: "0362972828",
      email: "trungnguyen98htmzzzl@gmail.com",
      role_id: 2
    }
    return register_model.register(data, (account_id) => {
      token = jwtservice.sign({ account_id })
      return account_id
    })
      .then(() => {
        return request(app)
          .get(`/user/profiles/1`)
          .set('x-access-token', `${token}`)
          .then((response) => {
            expect(response.body.user_name).toEqual("Nguyen Trung Nguyen 253")
          })
      })
  })

})

describe("Test PUT/:id profile API", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test PUT/:id profile api (TRUE)", async () => {
    let datalogin = {
      user_name: "Nguyen Trung Nguyen 253",
      phone_numbers: "0362972828",
      email: "trungasasdd@gmail.com",
      role_id: 2
    }
    let data = {
      user_name: "Nguyen",
      phone_numbers: "0362972828"
    }
    await register_model.register(datalogin, (account_id) => {
      token = jwtservice.sign({ account_id: account_id })
      return account_id
    }).then(() => {
      return request(app)
        .put(`/user/profiles/1`)
        .set('x-access-token', `${token}`)
        .send(data)
        .then((response) => {
          expect(response.body.user_name).toEqual("Nguyen")
        })
    })
  })

})

describe("Test PUT/change_password/:id change password API", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test PUT/change_password/:id change password API (TRUE)", async () => {
    let datalogin = {
      user_name: "Nguyen Trung Nguyen 253",
      password: "123456",
      phone_numbers: "0362972828",
      email: "trungasasdd@gmail.com",
      role_id: 2
    }
    datalogin.password = bcrypt.hashSync(datalogin.password, 8)
    let data = {
      old_password: "123456",
      new_password: "14041998"
    }
    await register_model.register(datalogin, (account_id) => {
      token = jwtservice.sign({ account_id: account_id })
      return account_id
    }).then(() => {
      return request(app)
        .put(`/user/profiles/change_password/1`)
        .set('x-access-token', `${token}`)
        .send(data)
        .then((response) => {
          expect(response.body.message).toEqual("Password is updated")
        })
    })
  })

  test("Test PUT/change_password/:id change password API (FALSE)", async () => {
    let datalogin = {
      user_name: "Nguyen Trung Nguyen 253",
      password: "123456",
      phone_numbers: "0362972828",
      email: "trungasasdd@gmail.com",
      role_id: 2
    }
    let data = {
      old_password: "456789",
      new_password: "14041998"
    }
    await register_model.register(datalogin, (account_id) => {
      token = jwtservice.sign({ account_id: account_id })
      return account_id
    }).then(() => {
      return request(app)
        .put(`/user/profiles/change_password/1`)
        .set('x-access-token', `${token}`)
        .send(data)
        .then((response) => {
          expect(response.body.message).toEqual("Password is not correct")
        })
    })
  })

})
