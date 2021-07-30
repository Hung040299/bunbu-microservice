const request = require('supertest')
const app = require('../appTest')
const register = require('../../models/dbPostgreSQL')
const register_model = new register()
const account_test = require('../lib/account')
const func_test = new account_test()
const jwtservice = require('../../config/jwt.service')
let token

describe("Test POST /conversation CV API", () => {

  beforeEach(() => {
    func_test.resetTable()
    let data = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 2
    }
    return register_model.register(data, (id) => {
      token = jwtservice.sign({ account_id: id })
    })
  })

  test("Test Create Conversation api", async () => {
    let user = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "hung@gmail.com",
      link_img: 'url',
      role_id: 2
    }

    return register_model.register(user, async (id) => {
      let conversation = {
        conversation_name: 'test',
        accounts: [id]
      }
      const response = await request(app)
        .post(`/conversations`)
        .set('x-access-token', `${token}`)
        .send(conversation)
      expect(response.statusCode).toBe(200)
      expect(response.body.conversation_name).toEqual("test")
    })
  })

});
