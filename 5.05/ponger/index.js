require('dotenv').config()
const express = require('express')
const http = require('http')
const db = require('./db/dbinit')
const app = express()
let PORT = process.env.PORT || 8080

const pongsModel = db.Pongs

const findCounterOrCreate = async () => {
  const counter = await pongsModel.findOne({ where: { name: 'counter' } })
  if (!counter) {
    return await pongsModel.create({ name: 'counter' })
  }
  return counter
}

app.get('/', async (req, res) => {
  res.status(200).send(`pong`)
})

app.get('/healthz', async (req, res) => {
  const connection = await db.checkDbConnection()
  if (connection) {
    res.status(200).end()
  } else {
    res.status(500).end()
  }
})

app.get('/pingpong', async (req, res) => {
  console.log('pong')
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