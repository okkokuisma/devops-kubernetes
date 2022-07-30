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

  // axios.request({
  //   url: `${baseUrl}/apis/stable.dwk/v1/dummysites?watch=true`,
  //   responseType: 'stream'
  // }).then(function (response) {
  //   response.data.pipe(countdown_stream)
  // })
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

// const k8s = require('@kubernetes/client-node')
// const mustache = require('mustache')
// const fs = require('fs').promises

// const timeouts = {}

// const kc = new k8s.KubeConfig();

// process.env.NODE_ENV === 'development' ? kc.loadFromDefault() : kc.loadFromCluster()

// const opts = {}
// kc.applyToRequest(opts)

// const client = kc.makeApiClient(k8s.CoreV1Api);

// const sendRequestToApi = async (api, method = 'get', options = {}) => new Promise((resolve, reject) => request[method](`${kc.getCurrentCluster().server}${api}`, {...opts, ...options, headers: { ...options.headers, ...opts.headers }}, (err, res) => err ? reject(err) : resolve(JSON.parse(res.body))))

// const createDeployment = async (fields) => {
//   console.log('Creating new deployment for countdown', fields.countdown_name, 'to namespace', fields.namespace)

//   const yaml = await getDepYAML(fields)

//   return sendRequestToApi(`/apis/apps/v1/namespaces/${fields.namespace}/deployments`, 'post', {
//     headers: {
//       'Content-Type': 'application/yaml'
//     },
//     body: yaml
//   })
// }

// const removeJob = async ({ namespace, job_name }) => {
//   const pods = await sendRequestToApi(`/api/v1/namespaces/${namespace}/pods/`)
//   pods.items.filter(pod => pod.metadata.labels['job-name'] === job_name).forEach(pod => removePod({ namespace, pod_name: pod.metadata.name }))

//   return sendRequestToApi(`/apis/batch/v1/namespaces/${namespace}/jobs/${job_name}`, 'delete')
// }

// const removeCountdown = ({ namespace, countdown_name }) => sendRequestToApi(`/apis/stable.dwk/v1/namespaces/${namespace}/countdowns/${countdown_name}`, 'delete')

// const removePod = ({ namespace, pod_name }) => sendRequestToApi(`/api/v1/namespaces/${namespace}/pods/${pod_name}`, 'delete')

// const cleanupForCountdown = async ({ namespace, countdown_name }) => {
//   console.log('Doing cleanup')
//   clearTimeout(timeouts[countdown_name])

//   const jobs = await sendRequestToApi(`/apis/batch/v1/namespaces/${namespace}/jobs`)
//   jobs.items.forEach(job => {
//     if (!job.metadata.labels.countdown === countdown_name) return

//     removeJob({ namespace, job_name: job.metadata.name })
//   })
// }

// const rescheduleJob = (jobObject) => {
//   const fields = fieldsFromJob(jobObject)
//   if (Number(fields.length) <= 1) {
//     console.log('Countdown ended. Removing countdown.')
//     return removeCountdown(fields)
//   }

//   // Save timeout so if the countdown is suddenly removed we can prevent execution (removing countdown removes job)
//   timeouts[fields.countdown_name] = setTimeout(() => {
//     removeJob(fields)
//     const newLength = Number(fields.length) - 1
//     const newFields = {
//       ...fields,
//       job_name: `${fields.container_name}-job-${newLength}`,
//       length: newLength
//     }
//     createJob(newFields)
//   }, Number(fields.delay))
// }

// const maintainStatus = async () => {
//   (await client.listPodForAllNamespaces()).body // A bug in the client(?) was fixed by sending a request and not caring about response

//   /**
//    * Watch Countdowns
//    */

//   const countdown_stream = new JSONStream()

//   countdown_stream.on('data', async ({ type, object }) => {
//     const fields = fieldsFromCountdown(object)

//     if (type === 'ADDED') {
//       if (await jobForCountdownAlreadyExists(fields)) return // Restarting application would create new 0th jobs without this check
//       createJob(fields)
//     }
//     if (type === 'DELETED') cleanupForCountdown(fields)
//   })

//   request.get(`${kc.getCurrentCluster().server}/apis/stable.dwk/v1/countdowns?watch=true`, opts).pipe(countdown_stream)

//   /**
//    * Watch Jobs
//    */

//   const job_stream = new JSONStream()

//   job_stream.on('data', async ({ type, object }) => {
//     if (!object.metadata.labels.countdown) return // If it's not countdown job don't handle
//     if (type === 'DELETED' || object.metadata.deletionTimestamp) return // Do not handle deleted jobs
//     if (!object?.status?.succeeded) return

//     rescheduleJob(object)
//   })

//   request.get(`${kc.getCurrentCluster().server}/apis/batch/v1/jobs?watch=true`, opts).pipe(job_stream)
// }

// maintainStatus()