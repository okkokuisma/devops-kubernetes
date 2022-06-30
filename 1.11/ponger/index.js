require('dotenv').config()
const writeFile = require('node:fs/promises').writeFile
const express = require('express')
const http = require('http')
const app = express()
let PORT = process.env.PORT || 3001

let counter = 0

app.get('/pingpong', async (req, res) => {
  counter++
  const content = `Ping / Pongs: ${counter}`
  try {
    await writeFile(`${__dirname}/files/log.txt`, content)
  } catch (err) {
    console.error(err)
  }
  res.send(`pong ${counter}`)
})

const start = async () => {
  const server = http.createServer(app)
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()