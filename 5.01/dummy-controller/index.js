require('dotenv').config()
const axios = require('axios')
const fs = require('fs').promises
const cors = require('cors')
const express = require('express')
const http = require('http')
const JSONStream = require('json-stream')
const k8s = require('@kubernetes/client-node')
const request = require('request')

const app = express()
const kc = new k8s.KubeConfig()

kc.loadFromDefault()
const opts = {}
kc.applyToRequest(opts)
const client = kc.makeApiClient(k8s.CoreV1Api)

// const WEBSITE_URL = process.env.WEBSITE_URL
let PORT = process.env.PORT || 3001
const htmlpath = `${__dirname}/dummy-htmls`
const baseUrl = kc.getCurrentCluster().server

app.use(cors())
app.get('/dummy/:name', (req, res) => {
  const dummyName = req.params.name
  try {
    fs.access(`${htmlpath}/dummy-${dummyName}.html`)
    res.status(200).sendFile(`${htmlpath}/dummy-${dummyName}.html`)
  } catch (error) {
    res.status(400).end()
  }
})

const createDummyHtml = async ({ url, name }) => {
  const response = await axios.get(url)
  try {
    await fs.writeFile(`${htmlpath}/dummy-${name}.html`, response.data)
  } catch (error) {
    if (error.code === 'ENOENT') {
      fs.mkdir(htmlpath)
      await fs.writeFile(`${htmlpath}/dummy-${name}.html`, response.data)
    }
  }
}

const cleanup = async (name) => {
  try {
    await fs.rm(`${htmlpath}/dummy-${name}.html`)
  } catch (error) {
    console.log(error)
  }
}

const dummyHtmlAlreadyExists = async (name) => {
  try {
    await fs.access(`${htmlpath}/dummy-${name}.html`)
    return true
  } catch (error) {
    return false
  }
}

const watchDummySiteStatus = async () => {
  (await client.listPodForAllNamespaces()).body.items

  const dummisite_stream = new JSONStream()

  dummisite_stream.on('data', async ({ type, object }) => {
    const fields = {
      url: object?.spec?.website_url,
      name: object?.metadata?.name
    }

    if (type === 'ADDED') {
      if (await dummyHtmlAlreadyExists(fields.name)) return
      await createDummyHtml(fields)
      console.log(`dummysite served at endpoint /dummy/${fields.name}`)
    }
    if (type === 'DELETED') await cleanup(fields.name)
  })

  request.get(`${kc.getCurrentCluster().server}/apis/stable.dwk/v1/dummysites?watch=true`, opts).pipe(dummisite_stream)
}

const startServer = () => {
  const server = http.createServer(app)
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

watchDummySiteStatus()
startServer()