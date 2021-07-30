const cvs = require('../../models/cv.model')
const cv_model = new cvs()
const profiles = require('../../models/profile.model')
const profile_model = new profiles.model()
const register = require('../../models/dbPostgreSQL')
const register_model = new register()
const account_test = require('../lib/account')
const func_test = new account_test()

process.env.NODE_ENV === 'test'

describe("Test showCV function ", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test showCV function", async () => {
    let data = {
      location: 'Ha Noi',
      skill: 'PHP',
      product: 'new PJ',
      old_company: 'MTA',
      programming_language_name: 'PHP'
    }
    let mockData = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 2
    };

    await register_model.register(mockData, (account_id) => {
      return account_id
    })
      .then(async (account_id) => {
        const cv = await profile_model.addCV(account_id, data)
        const showCV = await cv_model.showCV(cv.cv.cv_id)
        expect(showCV.location).toEqual('Ha Noi')
        expect(showCV.skill).toEqual('PHP')
      })
  })

})

describe("Test editCV function ", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test editCV function", async () => {
    let data = {
      location: 'Ha Noi',
      skill: 'PHP',
      product: 'new PJ',
      old_company: 'MTA',
      programming_language_name: 'PHP'
    }

    let dataEdit = {
      location: 'Viet Tri',
      skill: 'JAVA',
      product: 'JAVA',
      old_company: 'Viet Tri',
      programming_language_name: 'NODEJS'
    }

    let mockData = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 2
    };

    await register_model.register(mockData, (account_id) => {
      return account_id
    })
      .then(async (account_id) => {
        const cv = await profile_model.addCV(account_id, data)
        const editCV = await cv_model.editCV(cv.cv.cv_id, dataEdit)
        expect(editCV.cv.location).toEqual('Viet Tri')
        expect(editCV.cv.skill).toEqual('JAVA')
      })
  })

  describe("Test showAllCV function ", () => {

    beforeEach(() => {
      func_test.resetTable()
    })

    test("Test deleteCV function", async () => {
      let data = {
        location: 'Ha Noi',
        skill: 'PHP',
        product: 'new PJ',
        old_company: 'MTA',
        programming_language_name: 'PHP'
      }
      let mockData = {
        user_name: 'Nguyen Trung Nguyen 243',
        password: '19121998',
        phone_numbers: '0362972828',
        email: "trungnguyen98ht123123ml24iii3@gmail.com",
        link_img: 'url',
        role_id: 2
      };

      await register_model.register(mockData, (account_id) => {
        return account_id
      })
        .then(async (account_id) => {
          const cv = await profile_model.addCV(account_id, data)
          const deleteCV = await cv_model.deleteCV(cv.cv.cv_id)
          expect(deleteCV.rowCount).toEqual(1)
        })
    })

  })

})

describe("Test likeCV function ", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test likeCV function (true)", async () => {
    let user = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 2
    };
    let company = {
      user_name: 'company',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "company@gmail.com",
      link_img: 'url',
      role_id: 3
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

    let newCV;
    await register_model.register(user, (result) => {
      return result
    })
      .then(async (data) => {
        CV.user_role_id = await profiles.getUserRoleID(data)
        newCV = await profile_model.addCV(data, CV)
      })
    return register_model.register(company, async (result) => {
      const like = await cv_model.addLike(result, newCV.cv_id)
      expect(like.rowCount).toEqual
    })
  })
})

describe("Test likeCV function ", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test likeCV function (true)", async () => {
    let user = {
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
    let tagname = 'NodeJS'

    await register_model.register(user, (result) => {
      return result
    })
      .then(async (data) => {
        CV.user_role_id = await profiles.getUserRoleID(data)
        let newCV = await profile_model.addCV(data, CV)
        const result = await cv_model.addTagName(newCV.cv_id, tagname)
        expect(result.rowCount).toEqual(1)
      })
  })
})

describe("Test view CV by Tagname function ", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test view CV by Tagname function", async () => {
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
      old_company: 'MTA',
      programming_language_name: 'NodeJS'
    }
    let tag_name = 'VietTri'
    return register_model.register(mockData, (result) => {
      return result
    })
      .then(async (data) => {
        const newCV = await profile_model.addCV(data, CV)
        const result = await cv_model.addTagName(newCV.cv.cv_id, tag_name)
        const cvs = await cv_model.searchByTagName(tag_name)
        expect(cvs[0].location).toEqual('Viet Nam')
      })
  })

})

describe("Test view CV by Location function ", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test view CV by Location function", async () => {
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
      old_company: 'MTA',
      programming_language_name: 'NodeJS'
    }
    let location = 'Viet'
    return register_model.register(mockData, (result) => {
      return result
    })
      .then(async (data) => {
        const newCV = await profile_model.addCV(data, CV)
        const result = await cv_model.addTagName(newCV.cv.cv_id, location)
        const cvs = await cv_model.serchByLocation(location)
        expect(cvs[0].location).toEqual('Viet Nam')
      })
  })

})
