require('dotenv').config()
const express = require('express')
const http = require('http')
const app = express()
let PORT = process.env.PORT || 3001

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/hello.html`)
})

const start = async () => {
  const server = http.createServer(app)
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()