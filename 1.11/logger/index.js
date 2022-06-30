require('dotenv').config()
const readFile = require('node:fs/promises').readFile
const express = require('express')
const http = require('http')
const app = express()
let PORT = process.env.PORT || 3002

let currentString = ''
let content = ''

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

app.get('/', async (req, res) => {
  try {
    content = await readFile(`${__dirname}/files/log.txt`, 'utf8')
  } catch (err) {
    console.error(err)
  }

  res.send(`<p>${currentString}</p><p>${content}</p>`)
})

const start = async () => {
  startLogging()
  const server = http.createServer(app)
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()