require('dotenv').config()
const cors = require('cors')
const fs = require('fs')
const cron = require('cron')
const axios = require('axios')
const express = require('express')
const http = require('http')
const app = express()
const todoRouter = require('./controllers/todos')
const connectToDatabase = require('./db/dbInit').connectToDatabase
app.use(cors())
app.use(express.json())
let PORT = process.env.PORT || 3001

const fetchDailyImage = async () => {
  const filepath = `${__dirname}/public/dailyImage.jpg`
  const response = await axios({
    url: 'https://picsum.photos/200.jpg',
    method: 'GET',
    responseType: 'stream'
  })
  const imageFile = fs.createWriteStream(filepath)

  return new Promise((resolve, reject) => {
    imageFile
      .on('open', () => {
        response.data.pipe(imageFile)
          .on('error', reject)
          .once('close', () => resolve(filepath))
      })
  })
}

app.get('/api/image', async (req, res) => {
  if (!fs.existsSync(`${__dirname}/public/dailyImage.jpg`)) {
    await fetchDailyImage()
  }
  res.sendFile(`${__dirname}/public/dailyImage.jpg`)
})

app.use('/api/todos', todoRouter)

app.use('/', (req, res) => {
  res.status(200).send('pong')
})

const start = async () => {
  await connectToDatabase()
  const job = cron.job('0 0 * * *', fetchDailyImage)
  job.start()
  const server = http.createServer(app)
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()