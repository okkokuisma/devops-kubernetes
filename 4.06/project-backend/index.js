require('dotenv').config()
const cors = require('cors')
const fs = require('fs')
const cron = require('cron')
const axios = require('axios')
const express = require('express')
const http = require('http')
const app = express()
const todoRouter = require('./controllers/todos')
const db = require('./db/dbInit')
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

app.get('/', (req, res) => {
  res.status(200).send('pong')
})

app.get('/healthz', async (req, res) => {
  const connection = await db.checkDbConnection()
  if (connection) {
    res.status(200).end()
  } else {
    res.status(500).end()
  }
})

app.post('/msg', async (req, res) => {
  console.log('bojoing')
  console.log(req.body)
  res.status(200).send('juum')
})

const start = async () => {
  await db.connectToDatabase()
  const job = cron.job('0 0 * * *', fetchDailyImage)
  job.start()
  const server = http.createServer(app)
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()