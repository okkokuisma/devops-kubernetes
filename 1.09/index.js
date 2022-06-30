require('dotenv').config()
const express = require('express')
const http = require('http')
const app = express()
let PORT = process.env.PORT || 3001

let counter = 0

app.get('/pingpong', (req, res) => {
  res.send(`pong ${counter}`)
  counter++
})

const start = async () => {
  const server = http.createServer(app)
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()