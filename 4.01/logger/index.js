require('dotenv').config()
const express = require('express')
const http = require('http')
const axios = require('axios')
const app = express()
let PORT = process.env.PORT || 3002

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
  try {
    const pongs = await fetchPongs()
    res.status(200).send(`<p>${currentString}</p><p>${pongs}</p>`)
  } catch (error) {
    res.status(500).end()
  }
})

app.get('/healthz', async (req, res) => {
  const response = await axios.get('http://ponger-svc:4567/healthz')
  res.status(response.status).end()
})

const start = async () => {
  startLogging()
  const server = http.createServer(app)
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()