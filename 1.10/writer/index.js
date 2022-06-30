const fs = require('fs')

let content = ''

const start = () => {
  const getThemChars = () => {
    return Math.random().toString(36).substring(2)
  }

  setInterval(() => {
    const randomString = `${getThemChars()}-${getThemChars()}-${getThemChars()}`
    const date = new Date()
    content = `${date.toISOString()}: ${randomString}`

    fs.writeFile(`${__dirname}/files/log.txt`, content, err => {
      if (err) {
        console.error(err)
      }
    })
  }, 5000)
}

start()