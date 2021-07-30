const Model = require('../models/message.model');

const db = new Model();

module.exports = {
  createMessage: async (req, res) => {
    const { conversation_id } = req.params;
    const message = { ...req.body }
    if (req.files != null) {
      message.file_url = `./${req.files.file_url.name}`;
      req.files.file_url.mv(message.file_url, (err) => {
        if (err) res.status(500).send({ message: 'File Error' });
      });
    }
    const result = await db.createMessage(req.account_id, conversation_id, message);
    if (result) {
      global.io.sockets.in(conversation_id).emit('new message', { account_id: req.account_id, message: result });
      res.status(200).send({ message: result });
    } else {
      res.status(500).send({ message: 'Error' });
    }
  },

};
