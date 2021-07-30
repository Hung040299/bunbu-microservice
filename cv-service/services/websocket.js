class WebSockets {
  constructor() {
    this.users = []
  }
  connection(client) {

    client.on("disconnect", () => {
      this.users = this.users.filter((user) => user.socketId !== client.id);
    });

    client.on("identity", (account_id) => {
      this.users.push({
        socketId: client.id,
        account_id: account_id,
      });
    });

    client.on("joinConversation", (conversation_id, account_id) => {
      this.AddOtherUser(conversation_id, account_id);
      client.join(conversation_id);
    });

    client.on("leaveConversation", (conversation_id) => {
      client.leave(conversation_id);
    });
  }

  AddOtherUser(conversation_id, account_id) {
    const userSockets = this.users.filter(
      (user) => user.account_id === account_id
    );
    userSockets.map((userInfo) => {
      const socketConn = global.io.sockets.connected(userInfo.socketId);
      if (socketConn) {
        socketConn.join(conversation_id);
      }
    });
  }
}

module.exports = new WebSockets()
