const account_test = require('../lib/account');
const func_test = new account_test()
const register = require('../../models/dbPostgreSQL')
const register_model = new register()
const login = require('../../models/login.model').model;
const bcrypt = require('bcryptjs')
const db = new login()

process.env.NODE_ENV === 'test'

describe("Test Login function ", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test Login function (true)", async () => {
    let mockData = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 1
    };
    mockData.password = bcrypt.hashSync(mockData.password, 8)
    return register_model.register(mockData, (result) => {
      return result
    })
      .then(() => {
        return db.logIn(mockData.email, '19121998', (result) => {
          return result;
        })
          .then((data) => {
            expect(typeof data).toBe('string')
          })
      })
  })

  test("Test Login function (false)", async () => {
    let mockData = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 1
    };
    mockData.password = bcrypt.hashSync(mockData.password, 8)
    return register_model.register(mockData, (result) => {
      return result
    })
      .then(() => {
        return db.logIn('123131231', mockData.password, (result) => {
          return result;
        })
          .then((data) => {
            expect(data).toBe(false)
          })
      })
  })

  test("Test Login function (false)", async () => {
    let mockData = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 1
    };
    mockData.password = bcrypt.hashSync(mockData.password, 8)
    return register_model.register(mockData, (result) => {
      return result
    })
      .then(() => {
        return db.logIn(mockData.email, '123131231', (result) => {
          return result;
        })
          .then((data) => {
            expect(data).toBe(false)
          })
      })
  })

})
