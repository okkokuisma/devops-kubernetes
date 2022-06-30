const fs = require('fs')

let content = ''

const start = () => {
  setInterval(() => {
    fs.readFile(`${__dirname}/files/log.txt`, 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      if (data !== content) {
        content = data
        console.log(content)
      }
    })
  }, 500)
}

start()