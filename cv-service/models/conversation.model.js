const con = require('../config/postgreSql/postgreSQL');

function model() { };
model.prototype = {
  createConversation: async (message) => {
    let now = new Date()
    try {
      const conversation = await con.query('insert into conversations (conversation_name, type, account_id, created_at, updated_at) values ($1, $2, $3, $4, $5) returning *', [message.conversation_name, message.type, message.chatInitiator, now, now])
      if (conversation.rowCount > 0) {
        message.accounts.forEach(async account_id => {
          await con.query('insert into conversation_participants (conversation_id, account_id, created_at, updated_at) values ($1,$2,$3,$4) returning *', [conversation.rows[0].conversation_id, account_id, now, now])
        });
        return conversation.rows[0]
      }
    } catch {
      return false
    }
  },

}

module.exports = model
