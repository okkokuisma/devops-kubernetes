require('dotenv').config()
const express = require('express')
const http = require('http')
const db = require('./db/dbinit')
const app = express()
let PORT = process.env.PORT || 3001

const pongsModel = db.Pongs

const findCounterOrCreate = async () => {
  const counter = await pongsModel.findOne({ where: { name: 'counter' } })
  if (!counter) {
    return await pongsModel.create({ name: 'counter' })
  }
  return counter
}

app.get('/pingpong', async (req, res) => {
  const counter = await findCounterOrCreate()
  const incremented = await counter.increment('count')
  res.status(201).send(`pong ${incremented.count}`)
})

app.get('/pingpong/count', async (req, res) => {
  const counter = await findCounterOrCreate()
  res.status(200).send(`Ping / Pongs: ${counter.count}`)
})

const start = async () => {
  await db.connectToDatabase()
  const server = http.createServer(app)
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()