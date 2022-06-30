require('dotenv').config()
const express = require('express')
const http = require('http')
const app = express()
let PORT = process.env.PORT || 3001

let currentString

const startLogging = () => {
  const getThemChars = () => {
    return Math.random().toString(36).substring(2)
  }

  setInterval(() => {
    const randomString = `${getThemChars()}-${getThemChars()}-${getThemChars()}`
    const date = new Date()
    currentString = `${date.toISOString()}: ${randomString}`
    console.log(currentString)
  }, 5000)
}

app.get('/', (req, res) => {
  res.send(currentString)
})

const start = async () => {
  startLogging()
  const server = http.createServer(app)
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()