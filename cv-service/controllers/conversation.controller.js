const Model = require('../models/conversation.model')
const db = new Model()
module.exports = {
  createConversation: async (req, res) => {
    const chatInitiator = req.account_id
    const message = { ...req.body, chatInitiator }
    if (message.accounts.length > 1) {
      message.type = true
    }
    else {
      message.type = false
    }
    const conversation = await db.createConversation(message)
    if (conversation) {
      global.io.sockets.in(conversation.conversation_id).emit('new conversation', { message: 'Conversation is created' })
      res.status(200).send({
        message: 'create successfully',
        conversation_name: conversation.conversation_name
      })
    } else {
      res.send({ message: 'error' })
    }
  },

}
