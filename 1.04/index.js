require('dotenv').config()
const http = require('http')
let PORT = process.env.PORT

const start = async () => {
  const server = http.createServer()
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()