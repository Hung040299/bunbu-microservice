
const request = require('supertest')
const account_test = require('../lib/account')
const func_test = new account_test()
const bcrypt = require('bcryptjs')
const register = require('../../models/dbPostgreSQL')
const register_model = new register()
const app = require('../appTest')

describe('Test Login API', () => {
  beforeEach(() => {
    func_test.resetTable()
  })

  test('Test Login API (true)', async () => {
    let mockData = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 1
    }
    let dataLogin = {
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      password: '19121998'
    }
    mockData.password = bcrypt.hashSync(mockData.password, 8)
    return register_model.register(mockData, (result) => {
      return result
    })
      .then(() => {
        return request(app)
          .post('/login')
          .send(dataLogin)
          .then((response) => {
            expect(response.status).toBe(200)
            expect(typeof response.text).toBe('string')
          })
      })
  })

  test('Test Login API (False)', async () => {
    let mockData = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 1
    }
    const email = 'h@gmail.com'
    mockData.password = bcrypt.hashSync(mockData.password, 8)
    return register_model.register(mockData, (result) => {
      return result
    })
      .then(() => {
        return request(app)
          .post('/login')
          .send(email, mockData.password)
          .then((response) => {
            expect(response.body.message).toBe('Login fail')
            expect(response.status).toBe(401)
          })
      })
  })
})
