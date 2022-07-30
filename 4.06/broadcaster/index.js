require('dotenv').config()
const { connect, JSONCodec } = require('nats')
const axios = require('axios')
const NATS_URL = process.env.NATS_URL
const BROADCAST_URL = process.env.BROADCAST_URL
const { v4: uuidv4 } = require('uuid')
const id = uuidv4()

const start = async () => {
  console.log(NATS_URL)
  const nc = await connect({ servers: NATS_URL })
  const sc = JSONCodec()
  nc.publish('todo.subs', sc.encode({subId: id}))
  const sub = nc.subscribe('todo.actions')
  for await (const m of sub) {
    const msg = sc.decode(m.data)
    console.log(msg)
    if (msg.subId === id) {
      await axios.post(BROADCAST_URL, {
        user: msg.user || 'bot',
        action: msg.pubType,
        todo: msg.todo
      })
    }
  }
}

start()