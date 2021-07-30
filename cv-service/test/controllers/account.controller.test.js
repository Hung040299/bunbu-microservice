const request = require('supertest')
const app = require('../appTest')

const jwtservice = require('../../config/jwt.service')
const listdata = require('../__mocks__/UserMork')
const account_test = require('../lib/account')
const func_test = new account_test()

const register = require('../../models/dbPostgreSQL')
const register_model = new register()

process.env.NODE_ENV === 'test'

let token
describe("Test listAccount API", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test GET accounts api (Admin Access)", async () => {
    listdata.data.forEach(item => {
      func_test.createAccount(item)
    });

    let datalogin = {
      user_name: "Nguyen Trung Nguyen 253",
      password: "19121998",
      phone_numbers: "0362972828",
      email: "trungnguyen98htmzzzl@gmail.com",
      role_id: 1
    }

    await register_model.register(datalogin, (id) => {
      return id
    })
      .then((id) => {
        token = jwtservice.sign({ account_id: id })
        return request(app)
          .get('/admin/accounts')
          .set('x-access-token', `${token}`)
          .then((response) => {
            expect(response.statusCode).toBe(200)
            expect(response.body.length).toBe(6)
            expect(response.body[0].email).toEqual('nguyen1@gmail.com')
          })
      })
  })

  test("Test GET accounts api (ACCESS DENIED)", async () => {
    listdata.data.forEach(item => {
      func_test.createAccount(item)
    });
    return request(app)
      .get('/admin/accounts')
      .then((response) => {
        expect(response.body.message).toEqual('ACCESS DENIED')
      })
  })
})

describe("Register asks", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Creates a new user (Create Success)", async () => {
    let data = {
      user_name: "Nguyen Trung Nguyen 253",
      password: "19121998",
      phone_numbers: "0362972828",
      email: "trungnguyen98htmzzzl@gmail.com",
      role_id: 1
    }
    return request(app)
      .post("/register")
      .send(data)
      .expect(200)
  });

  test("Create a new accounts (Create Account false)", async () => {
    let data = {
      user_name: "Nguyen Trung Nguyen 253",
      password: "19121998",
      phone_numbers: "0362972828",
    }
    const response = await request(app)
      .post("/register")
      .send(data)
    expect(response.body.message).toBe('Can not create account')
  });

  test("Creates a new user (Create Role false)", async () => {
    let data = {
      user_name: "Nguyen Trung Nguyen 253",
      password: "19121998",
      phone_numbers: "0362972828",
      email: "trungnguyen98htmzzzl@gmail.com",
    }
    const response = await request(app)
      .post("/register")
      .send(data)
    expect(response.body.message).toBe('Can not create Role')
  });

});

describe("Create account asks (Admin Access)", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Create a new account (Create Success)", async () => {

    let datalogin = {
      user_name: "Nguyen Trung Nguyen 253",
      password: "19121998",
      phone_numbers: "0362972828",
      email: "trungasasdd@gmail.com",
      role_id: 1
    }

    let data = {
      user_name: "Nguyen Trung Nguyen 253",
      password: "19121998",
      phone_numbers: "0362972828",
      email: "trungnguyen98htmzzzl@gmail.com",
      role_id: 1
    }
    await register_model.register(datalogin, (id) => {
      token = jwtservice.sign({ account_id: id })
    })
      .then(() => {
        return request(app)
          .post("/admin/accounts")
          .set('x-access-token', `${token}`)
          .send(data)
          .expect(200)
      })
  })

  test("Create a new account (Create Role false)", async () => {

    let datalogin = {
      user_name: "Nguyen Trung Nguyen 253",
      password: "19121998",
      phone_numbers: "0362972828",
      email: "trungasasdd@gmail.com",
      role_id: 1
    }

    let data = {
      user_name: "Nguyen Trung Nguyen 253",
      password: "19121998",
      phone_numbers: "0362972828",
      email: "trungnguyen98htmzzzl@gmail.com",
    }

    await register_model.register(datalogin, (id) => {
      token = jwtservice.sign({ account_id: id })
      return id
    }).then(() => {
      return request(app)
        .post("/admin/accounts")
        .set('x-access-token', `${token}`)
        .send(data)
        .then((response) => {
          expect(response.body.message).toBe('Can not create Role')
        })
    })
  });

  test("Create a new accounts (Create Account false)", async () => {
    let datalogin = {
      user_name: "Nguyen Trung Nguyen 253",
      password: "19121998",
      phone_numbers: "0362972828",
      email: "trungasasdd@gmail.com",
      role_id: 1
    }

    let data = {
      user_name: "Nguyen Trung Nguyen 253",
      password: "19121998",
      phone_numbers: "0362972828",
    }
    await register_model.register(datalogin, (id) => {
      token = jwtservice.sign({ account_id: id })
      return id
    }).then(() => {
      return request(app)
        .post("/admin/accounts")
        .set('x-access-token', `${token}`)
        .send(data)
        .then((response) => {
          expect(response.body.message).toBe('Can not create account')
        })
    })
  });

});

describe("Test GET/:id account API(Admin Access)", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test GET/:id accounts api", async () => {
    let data = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 1
    }

    return register_model.register(data, (id) => {
      token = jwtservice.sign({ account_id: id })
      return request(app)
        .get(`/admin/accounts/${id}`)
        .set('x-access-token', `${token}`)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          expect(response.body.email).toEqual("trungnguyen98ht123123ml24iii3@gmail.com")
        })
    })
  })

})

describe("Create account asks (ACCESS DENIED)", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Create a new account (Create Success)", async () => {
    let data = {
      user_name: "Nguyen Trung Nguyen 253",
      password: "19121998",
      phone_numbers: "0362972828",
      email: "trungnguyen98htmzzzl@gmail.com",
      role_id: 1
    }
    return request(app)
      .post("/admin/accounts")
      .send(data)
      .then((response) => {
        expect(response.body.message).toEqual("ACCESS DENIED")
      })
  });

  test("Create a new account (Create Role false)", async () => {
    let data = {
      user_name: "Nguyen Trung Nguyen 253",
      password: "19121998",
      phone_numbers: "0362972828",
      email: "trungnguyen98htmzzzl@gmail.com",
    }
    const response = await request(app)
      .post("/admin/accounts")
      .send(data)
    expect(response.body.message).toBe('ACCESS DENIED')
  });

  test("Create a new accounts (Create Account false)", async () => {
    let data = {
      user_name: "Nguyen Trung Nguyen 253",
      password: "19121998",
      phone_numbers: "0362972828",
    }
    const response = await request(app)
      .post("/admin/accounts")
      .send(data)
    expect(response.body.message).toBe('ACCESS DENIED')
  });

});

describe("Test GET/:id account API", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test GET/:id accounts api", async () => {
    let data = {
      user_name: "Nguyen Trung Nguyen 253",
      password: "19121998",
      phone_numbers: "0362972828",
      email: "trungnguyen98htmzzzl@gmail.com",
      role_id: 1
    }

    const id = await func_test.createAccount(data)
    return request(app)
      .get(`/admin/accounts/${id}`)
      .then((response) => {
        expect(response.body.message).toEqual("ACCESS DENIED")
      })
  })

})

describe("Test DELETE/:id account API", () => {

  beforeEach(() => {
    let datalogin = {
      user_name: "Nguyen Trung Nguyen 253",
      password: "19121998",
      phone_numbers: "0362972828",
      email: "trungasasdd@gmail.com",
      role_id: 1
    }
    func_test.resetTable()
    return register_model.register(datalogin, (id) => {
      token = jwtservice.sign({ account_id: id })
    })
  })

  test("Test DELETE/:id accounts api (SUCCESS)", async () => {
    let data = {
      user_name: "Nguyen Trung Nguyen 253",
      password: "19121998",
      phone_numbers: "0362972828",
      email: "trungnguyen98htmzzzl@gmail.com",
      role_id: 1
    }
    await register_model.register(data, (account_id) => {
      return account_id
    })
      .then((id) => {
        return request(app)
          .delete(`/admin/accounts/${id}`)
          .set('x-access-token', `${token}`)
          .then((response) => {
            expect(response.body.message).toEqual("Account is deleted")
          })
      })
  })

  test("Test DELETE/:id accounts api (FAIL)", async () => {
    let data = {
      user_name: "Nguyen Trung Nguyen 253",
      password: "19121998",
      phone_numbers: "0362972828",
      email: "trungnguyen98htmzzzl@gmail.com",
      role_id: 1
    }
    const id = 1000000
    await register_model.register(data, (account_id) => {
      return account_id
    })
      .then(() => {
        return request(app)
          .delete(`/admin/accounts/${id}`)
          .set('x-access-token', `${token}`)
          .then((response) => {
            expect(response.body.message).toEqual("Account is not exist")
          })
      })
  })

})

describe("Test PUT/:id account API", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test PUT/:id accounts api (TRUE)", async () => {
    let datalogin = {
      user_name: "Nguyen Trung Nguyen 253",
      phone_numbers: "0362972828",
      email: "trungasasdd@gmail.com",
      role_id: 1
    }
    let data = {
      user_name: "Nguyen",
      phone_numbers: "0362972828",
      role_id: 2
    }
    await register_model.register(datalogin, (account_id) => {
      token = jwtservice.sign({ account_id: account_id })
      return account_id
    }).then((id) => {
      return request(app)
        .put(`/admin/accounts/${id}`)
        .set('x-access-token', `${token}`)
        .send(data)
        .then((response) => {
          expect(response.statusCode).toBe(200)
          expect(response.body.user_name).toEqual("Nguyen")
        })
    })
  })

  test("Test PUT/:id accounts api (FALSE)", async () => {
    let datalogin = {
      user_name: "Nguyen Trung Nguyen 253",
      phone_numbers: "0362972828",
      email: "trungasasdd@gmail.com",
      role_id: 1
    }
    let data = {
      user_name: "Nguyen Trung Nguyen 253",
      phone_numbers: "0362972828",
      email: "trungasasdd@gmail.com",
      role_id: 1
    }
    await register_model.register(datalogin, (account_id) => {
      token = jwtservice.sign({ account_id: account_id })
      return account_id
    }).then(() => {
      const id = 10000000
      return request(app)
        .put(`/admin/accounts/${id}`)
        .set('x-access-token', `${token}`)
        .send(data)
        .then((response) => {
          expect(response.body.message).toEqual("Account is not exist")
        })
    })
  })

})
