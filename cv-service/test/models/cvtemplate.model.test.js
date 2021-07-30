const register = require('../../models/dbPostgreSQL')
const register_model = new register()
const account_test = require('../lib/account')
const func_test = new account_test()
const cvtemplate = require('../../models/cvtemplate.model')
const cvtemplate_model = new cvtemplate()

process.env.NODE_ENV === 'test'

let data = {
  location: 'Ha Noi',
  skill: 'PHP',
  product: 'new PJ',
  old_company: 'MTA',
  programming_language_template_name: 'PHP'
}
let mockData = {
  user_name: 'Nguyen Trung Nguyen 243',
  password: '19121998',
  phone_numbers: '0362972828',
  email: "trungnguyen98ht123123ml24iii3@gmail.com",
  link_img: 'url',
  role_id: 1
};

describe("Test showCVTemplate function ", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test showCVTemplate function", async () => {

    return register_model.register(mockData, (account_id) => {
      return account_id
    })
      .then(async (account_id) => {
        const cv = await cvtemplate_model.addCV(account_id, data)
        const showCV = await cvtemplate_model.showCV(cv.cv.cv_template_id)
        expect(showCV.location).toEqual('Ha Noi')
      })
  })

})

describe("Test editCVTemplate function ", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test editCVTemplate function", async () => {

    let dataEdit = {
      location: 'Viet Tri',
      skill: 'JAVA',
      product: 'JAVA',
      old_company: 'Viet Tri',
      programming_language_template_name: 'NODEJS'
    }

    return register_model.register(mockData, (account_id) => {
      return account_id
    })
      .then(async (account_id) => {
        const cv = await cvtemplate_model.addCV(account_id, data)
        const editCV = await cvtemplate_model.editCV(cv.cv.cv_template_id, dataEdit)
        expect(editCV.cv.location).toEqual('Viet Tri')
        expect(editCV.cv.skill).toEqual('JAVA')
      })
  })

})

describe("Test DELETE cvTemplate function ", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test delete cvTemplate function", async () => {
    let mockData = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 1
    };

    return register_model.register(mockData, (account_id) => {
      return account_id
    })
      .then(async (account_id) => {
        const cv = await cvtemplate_model.addCV(account_id, data)
        const deleteCV = await cvtemplate_model.deleteCV(cv.cv.cv_template_id)
        expect(deleteCV.rowCount).toEqual(1)
      })
  })

})

