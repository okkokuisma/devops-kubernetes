const { connect, JSONCodec } = require('nats')
const NATS_URL = process.env.NATS_URL
const sc = JSONCodec()
const ncProm = connect({ servers: NATS_URL })
const subs = []

const start = async () => {
  const nc = await ncProm
  console.log(nc)
  const sub = nc.subscribe('todo.subs')
  for await (const m of sub) {
    const msg = sc.decode(m.data)
    console.log(msg)
    subs.push(msg.subId)
    console.log(subs)
  }
}

start()

exports.publishToNats = ncProm
  .then(c => {
    return async (msg) => {
      const subId = subs[Math.floor(Math.random()*subs.length)]
      c.publish('todo.actions', sc.encode({...msg, subId}))
    }
  })
