const channel = require('../rabbitmq/channelCreator')
const jwt = require('jsonwebtoken')
const consumeAuthRequest = async (req, res) => {
  channel.channel.assertExchange('authExchange', 'direct', { durable: false })
  channel.channel.assertQueue('authQueue', {
    durable: false
  }, (err, q) => {
    if (err) throw err
    console.log(q)
    channel.channel.bindQueue(q.queue, 'authExchange', 'test');
    channel.channel.consume(q.queue, (msg) => {
      let verified = jwt.verify(msg.content.toString(), process.env.SECRET);
      console.log(verified)
      channel.channel.assertExchange('resendExchange', 'direct', { durable: false })
      channel.channel.assertQueue('resendQueue', {
        durable: false
      });
      channel.channel.bindQueue('resendQueue', 'resendExchange', 'key');
      channel.channel.publish('resendExchange', 'key', Buffer.from(JSON.stringify(verified)))
    }, { noAck: true })
  })
  res.send('success')
}

const consumeAuthRequestCV = async (req, res) => {
  channel.channel.assertExchange('authExchange', 'direct', { durable: false })
  channel.channel.assertQueue('authCVQueue', {
    durable: false
  }, (err, q) => {
    if (err) throw err
    console.log(q)
    channel.channel.bindQueue(q.queue, 'authExchange', 'CvService');
    channel.channel.consume(q.queue, (msg) => {
      let verified = jwt.verify(msg.content.toString(), process.env.SECRET);
      console.log(verified)
      channel.channel.assertExchange('resendExchange', 'direct', { durable: false })
      channel.channel.assertQueue('resendCVQueue', {
        durable: false
      });
      channel.channel.bindQueue('resendCVQueue', 'resendExchange', 'CvService');
      channel.channel.publish('resendExchange', 'CvService', Buffer.from(JSON.stringify(verified)))
    }, { noAck: true })
  })
  res.send('success')
}

module.exports = {consumeAuthRequest, consumeAuthRequestCV}
