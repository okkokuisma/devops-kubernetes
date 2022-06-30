require('dotenv').config()
const express = require('express')
const http = require('http')
const app = express()
let PORT = process.env.PORT || 3001

let counter = 0

app.get('/pingpong', async (req, res) => {
  counter++
  res.send(`pong ${counter}`)
})

app.get('/pingpong/count', async (req, res) => {
  res.send(`Ping / Pongs: ${counter}`)
})

const start = async () => {
  const server = http.createServer(app)
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()