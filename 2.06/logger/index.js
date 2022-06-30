require('dotenv').config()
const express = require('express')
const http = require('http')
const axios = require('axios')
const app = express()
let PORT = process.env.PORT || 3002
let MESSAGE = process.env.MESSAGE

let currentString = ''

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

//'http://ponger-svc:4567/pingpong/count'
const fetchPongs = async () => {
  const res = await axios.get('http://ponger-svc:4567/pingpong/count')
  return res.data
}

app.get('/', async (req, res) => {
  const pongs = await fetchPongs()
  console.log(pongs)
  res.send(`<p>${MESSAGE}<p>${currentString}<p>${pongs}`)
})

const start = async () => {
  startLogging()
  const server = http.createServer(app)
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()