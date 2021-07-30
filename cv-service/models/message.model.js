const con = require('../config/postgreSql/postgreSQL');

function model() { }
model.prototype = {
  createMessage: async (account_id, conversation_id, message) => {
    const now = new Date();
    try {
      const postMessage = 'insert into messages (message_content, type, account_id, conversation_id, created_at, updated_at) values ($1, $2, $3, $4, $5, $6) returning *';
      const result = await con.query(postMessage, [message.message_content, message.type, account_id, conversation_id, now, now]);
      if (message.file_url != null) {
        const postFile = 'insert into files (url, type, message_id, created_at, updated_at) values ($1, $2, $3, $4, $5) returning *';
        const file = await con.query(postFile, [message.file_url, message.file_type, result.rows[0].message_id, now, now]);
        return { message: result.rows[0], file: file.rows[0] };
      }
      return result.rows[0];
    } catch {
      return false;
    }
  },

  deleteMessage: async (message_id) => {
    const message = await con.query('delete from message where message_id = $1', [message_id]);
    if (message.rowsCount) return true;
    return false;
  },
};
module.exports = model;
