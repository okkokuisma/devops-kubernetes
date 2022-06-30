const start = () => {
  const getThemChars = () => {
    return Math.random().toString(36).substring(2)
  }

  setInterval(() => {
    const randomString = `${getThemChars()}-${getThemChars()}-${getThemChars()}`
    const date = new Date()
    console.log(`${date.toISOString()}: ${randomString}`)
  }, 5000)
}

start()