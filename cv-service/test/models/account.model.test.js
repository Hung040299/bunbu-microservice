const account = require('../../models/account.model')
const acc_model = new account()
const listdata = require('../__mocks__/UserMork')
const model = require("../../models/dbPostgreSQL");
const db = new model();

const account_test = require('../lib/account');
const register = require('../../controllers/register.controller');
const func_test = new account_test()

process.env.NODE_ENV === 'test'

describe("Test listAccount API", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test listAccount function", async () => {
    listdata.data.forEach(item => {
      func_test.createAccount(item);
    });
    return acc_model.listAccount((result) => {
      return result;
    })
      .then((data) => {
        expect(data.rows).toEqual(expect.any(Array))
        expect(data.rows).toHaveLength(5)
        expect(data.rows[0].email).toEqual('nguyen1@gmail.com')
      })
  })
})

describe("Test register API", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test db checkExistByEmail function (not EXIST)", async () => {
    return db.checkExistByEmail(listdata.mockData, function (result) {
      return result;
    })
      .then((data) => {
        expect(data).toBe(true);
      });
  });

  test("Test db checkExistByEmail function (is EXIST)", async () => {
    func_test.createAccount(listdata.mockData);
    return db.checkExistByEmail(listdata.mockData, function (result) {
      return result;
    })
      .then((data) => {
        expect(data).toBe(null);
      });
  });

  test("Test db register function (create success)", async () => {
    return db.register(listdata.mockData, function (result) {
      return result;
    })
      .then((data) => {
        expect(typeof data).toBe('number');
      });
  });

  test("Test db register function (create role false)", async () => {

    let mockData = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: '12313123',
      link_img: 'url'
    };

    return db.register(mockData, function (result) {
      return result;
    })
      .then((data) => {
        expect(data).toBe(null);
      });
  });

  test("Test db register function (create account false)", async () => {

    let mockData = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      link_img: 'url',
    };

    return db.register(mockData, function (result) {
      return result;
    })
      .then((data) => {
        expect(data).toBe(false);
      });
  });

});

describe("Test GET/:id account API", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test db getByID function (true)", async () => {
    let resgister = {
      user_name: "Nguyen Trung Nguyen 253",
      password: "19121998",
      phone_numbers: "0362972828",
      email: "trungnguyen98htmzzzl@gmail.com",
      role_id: 1
    }

    const account_id = await func_test.createAccount(resgister)
    expect(typeof account_id).toBe('number')

    const acc = await acc_model.getByID(account_id)
    expect(acc.email).toEqual("trungnguyen98htmzzzl@gmail.com")
  });

});

describe("Test Delete Function", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test db deleteAccount function ", async () => {
    let resgisterdata = {
      user_name: "Nguyen Trung Nguyen 253",
      phone_numbers: "0362972828",
      email: "trungnguyen98htmzzzl@gmail.com",
      role_id: 1
    }

    await db.register(resgisterdata, (account_id) => {
      return account_id
    })
      .then(async (data) => {
        const acc = await acc_model.deleteAccount(data)
        expect(acc.rowCount).toBe(1)
      })
  });
})

describe("Test Update Function", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test db updateAccount function (UPDATE ROLE) ", async () => {
    
    const dataUpdate = {
      user_name: "Nguyen",
      phone_numbers: "0362972828",
      role_id: 2
    }

    return db.register(listdata.mockData, (account_id) => {
      return account_id
    })
      .then(async (data) => {
        const acc = await acc_model.updateAccount(data, dataUpdate)
        const role = await acc_model.checkRoleAccount(data)
        expect(acc.rowCount).toBe(1)
        expect(role.rows[0].role_name).toEqual('user')
        expect(acc.rows[0].user_name).toEqual("Nguyen")
      })
  });

  test("Test db updateAccount function (NOT UPDATE ROLE) ", async () => {
    
    const dataUpdate = {
      user_name: "Nguyen",
      password: "19121998",
      phone_numbers: "0362972828"
    }

    return db.register(listdata.mockData, (account_id) => {
      return account_id
    })
      .then(async (data) => {
        const old_role = await acc_model.checkRoleAccount(data)
        const acc = await acc_model.updateAccount(data, dataUpdate)
        const role = await acc_model.checkRoleAccount(data)
        expect(acc.rowCount).toBe(1)
        expect(role.rows[0].role_id).toEqual(old_role.rows[0].role_id)
        expect(acc.rows[0].user_name).toEqual("Nguyen")
      })
  });

})
