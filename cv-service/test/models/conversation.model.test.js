const conversation = require('../../models/conversation.model')
const conversation_model = new conversation()
const register = require('../../models/dbPostgreSQL')
const register_model = new register()
const account_test = require('../lib/account')
const func_test = new account_test()

process.env.NODE_ENV === 'test'

describe("Test create conversation function ", () => {

  beforeEach(() => {
    func_test.resetTable()
  })

  test("Test create conversation function", async () => {

    let user1 = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "trungnguyen98ht123123ml24iii3@gmail.com",
      link_img: 'url',
      role_id: 2
    };

    let user2 = {
      user_name: 'Nguyen Trung Nguyen 243',
      password: '19121998',
      phone_numbers: '0362972828',
      email: "hung@gmail.com",
      link_img: 'url',
      role_id: 2
    };

    register_model.register(user1, (account_id) => {
      return account_id
    })
      .then((account_id1) => {
        register_model.register(user2, (account_id2) => {
          return { account_id1, account_id2 }
        })
      })
      .then(async (accounts) => {
        let conversation = {
          conversation_name: "test",
          accounts: [accounts.account_id1, accounts.account_id2]
        }
        const result = await conversation_model.createConversation(conversation)
        expect(result.conversation_name).toEqual('test')
      })
  })
})
